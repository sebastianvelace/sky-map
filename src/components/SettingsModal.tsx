import { X, Key, ExternalLink } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

const SettingsModal = ({ isOpen, onClose, apiKey, onApiKeyChange }: SettingsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-cosmic">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary"
        >
          <X size={20} />
        </button>
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-cosmic-blue/20 rounded-lg">
            <Key className="w-5 h-5 text-cosmic-blue" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">Configuración</h2>
            <p className="text-sm text-muted-foreground">API Key de Google Gemini</p>
          </div>
        </div>
        
        {/* API Key input */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-foreground">
            Tu Gemini API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => onApiKeyChange(e.target.value)}
            placeholder="AIza..."
            className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cosmic-blue/50 focus:border-cosmic-blue transition-all"
          />
          <p className="text-xs text-muted-foreground">
            Tu API key se guarda localmente en tu navegador y nunca se comparte.
          </p>
        </div>
        
        {/* Get API Key link */}
        <a
          href="https://aistudio.google.com/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl transition-all font-medium"
        >
          <span>Obtener API Key gratis</span>
          <ExternalLink size={16} />
        </a>
        
        {/* Save button */}
        <button
          onClick={onClose}
          className="mt-3 w-full py-3 bg-gradient-button text-primary-foreground rounded-xl font-semibold shadow-glow-blue hover:opacity-90 transition-all"
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
