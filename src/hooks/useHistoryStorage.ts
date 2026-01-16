import { useState, useEffect, useCallback } from 'react';

export interface HistoryEntry {
  id: string;
  imageBase64: string;
  result: string;
  timestamp: number;
  extractedName?: string;
}

const DB_NAME = 'StarsAIHistory';
const STORE_NAME = 'analyses';
const DB_VERSION = 1;

// Helper to extract main constellation/star name from result
function extractMainName(result: string): string {
  // Look for bold text patterns like **Orión** or **Sirio**
  const boldMatch = result.match(/\*\*([^*]+)\*\*/);
  if (boldMatch) return boldMatch[1];
  
  // Look for ## headers
  const headerMatch = result.match(/##\s*(.+)/);
  if (headerMatch) return headerMatch[1].trim();
  
  return 'Análisis del cielo';
}

// Check if IndexedDB is available
function isIndexedDBAvailable(): boolean {
  try {
    return typeof indexedDB !== 'undefined';
  } catch {
    return false;
  }
}

// Open IndexedDB connection
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

// localStorage fallback
const LS_KEY = 'starsai_history';

function getFromLocalStorage(): HistoryEntry[] {
  try {
    const data = localStorage.getItem(LS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveToLocalStorage(entries: HistoryEntry[]): void {
  try {
    // Limit to 20 entries and compress images for localStorage
    const limited = entries.slice(0, 20);
    localStorage.setItem(LS_KEY, JSON.stringify(limited));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

export function useHistoryStorage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useIndexedDB, setUseIndexedDB] = useState(true);

  // Load entries on mount
  useEffect(() => {
    async function loadEntries() {
      setIsLoading(true);
      
      if (isIndexedDBAvailable()) {
        try {
          const db = await openDB();
          const tx = db.transaction(STORE_NAME, 'readonly');
          const store = tx.objectStore(STORE_NAME);
          const index = store.index('timestamp');
          
          const request = index.openCursor(null, 'prev');
          const results: HistoryEntry[] = [];
          
          request.onsuccess = (event) => {
            const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
            if (cursor) {
              results.push(cursor.value);
              cursor.continue();
            } else {
              setEntries(results);
              setIsLoading(false);
            }
          };
          
          request.onerror = () => {
            console.warn('IndexedDB read failed, falling back to localStorage');
            setUseIndexedDB(false);
            setEntries(getFromLocalStorage());
            setIsLoading(false);
          };
          
          db.close();
        } catch {
          setUseIndexedDB(false);
          setEntries(getFromLocalStorage());
          setIsLoading(false);
        }
      } else {
        setUseIndexedDB(false);
        setEntries(getFromLocalStorage());
        setIsLoading(false);
      }
    }
    
    loadEntries();
  }, []);

  // Add new entry
  const addEntry = useCallback(async (imageBase64: string, result: string) => {
    const newEntry: HistoryEntry = {
      id: crypto.randomUUID(),
      imageBase64,
      result,
      timestamp: Date.now(),
      extractedName: extractMainName(result),
    };

    if (useIndexedDB && isIndexedDBAvailable()) {
      try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.add(newEntry);
        db.close();
      } catch (e) {
        console.warn('IndexedDB add failed:', e);
      }
    } else {
      const updated = [newEntry, ...getFromLocalStorage()];
      saveToLocalStorage(updated);
    }

    setEntries(prev => [newEntry, ...prev]);
  }, [useIndexedDB]);

  // Delete single entry
  const deleteEntry = useCallback(async (id: string) => {
    if (useIndexedDB && isIndexedDBAvailable()) {
      try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.delete(id);
        db.close();
      } catch (e) {
        console.warn('IndexedDB delete failed:', e);
      }
    } else {
      const updated = getFromLocalStorage().filter(e => e.id !== id);
      saveToLocalStorage(updated);
    }

    setEntries(prev => prev.filter(e => e.id !== id));
  }, [useIndexedDB]);

  // Clear all entries
  const clearAll = useCallback(async () => {
    if (useIndexedDB && isIndexedDBAvailable()) {
      try {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.clear();
        db.close();
      } catch (e) {
        console.warn('IndexedDB clear failed:', e);
      }
    } else {
      localStorage.removeItem(LS_KEY);
    }

    setEntries([]);
  }, [useIndexedDB]);

  return {
    entries,
    isLoading,
    count: entries.length,
    addEntry,
    deleteEntry,
    clearAll,
  };
}
