import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { ConstellationData } from '@/components/ConstellationCard';
import { Region } from '@/data/constellations';
import { supabase } from '@/integrations/supabase/client';

interface CosmosQAResponse {
  answer?: string;
  error?: string;
}

interface CosmosQAInput {
  question: string;
}

export interface QAEntry {
  id: string;
  question: string;
  answer: string;
  timestamp: Date;
}

export type ConstellationWithRegion = ConstellationData & {
  region: Region;
};

const fetchCosmosAnswer = async (question: string) => {
  const { data, error } = await supabase.functions.invoke<CosmosQAResponse, CosmosQAInput>('cosmos-qa', {
    body: { question },
  });

  if (error) {
    throw new Error(error.message || 'Error al conectar con el servidor');
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  if (!data?.answer) {
    throw new Error('No se pudo obtener respuesta. Intenta reformular tu pregunta.');
  }

  return data.answer;
};

const normalizeConstellation = (item: Record<string, unknown>): ConstellationWithRegion => {
  const funFacts = item.funFacts ?? item.fun_facts;
  const parsedFunFacts = Array.isArray(funFacts)
    ? funFacts.map((fact) => String(fact))
    : typeof funFacts === 'string'
      ? [funFacts]
      : [];

  return {
    id: String(item.id ?? ''),
    name: String(item.name ?? ''),
    latinName: String(item.latinName ?? item.latin_name ?? ''),
    imageUrl: String(item.imageUrl ?? item.image_url ?? ''),
    fallbackUrl: String(item.fallbackUrl ?? item.fallback_url ?? ''),
    color: String(item.color ?? '#4a9eff'),
    visibility: String(item.visibility ?? ''),
    bestTime: String(item.bestTime ?? item.best_time ?? ''),
    direction: String(item.direction ?? ''),
    brightness: String(item.brightness ?? ''),
    mythology: String(item.mythology ?? ''),
    funFacts: parsedFunFacts,
    region: String(item.region ?? 'equatorial') as Region,
  };
};

const fetchGalleryByRegion = async (region: Region): Promise<ConstellationWithRegion[]> => {
  const { data, error } = await (supabase as any)
    .from('constellations')
    .select('*')
    .eq('region', region)
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message || 'No se pudo cargar la galería');
  }

  if (!data) {
    return [];
  }

  return data.map((item: Record<string, unknown>) => normalizeConstellation(item));
};

export const useCosmosQA = () => {
  const [history, setHistory] = useState<QAEntry[]>([]);

  const mutation = useMutation({
    mutationFn: fetchCosmosAnswer,
    onSuccess: (answer, question) => {
      const entry: QAEntry = {
        id: crypto.randomUUID(),
        question,
        answer,
        timestamp: new Date(),
      };

      setHistory((prev) => [entry, ...prev].slice(0, 5));
    },
  });

  return {
    currentAnswer: mutation.data ?? null,
    history,
    askQuestion: mutation.mutate,
    askQuestionAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
    clearError: mutation.reset,
  };
};

export const useGalleryConstellations = (region: Region) => {
  const query = useQuery({
    queryKey: ['gallery-constellations', region],
    queryFn: () => fetchGalleryByRegion(region),
  });

  const error = useMemo(() => {
    if (!(query.error instanceof Error)) return null;
    return query.error.message;
  }, [query.error]);

  return {
    constellations: query.data ?? [],
    isLoading: query.isPending,
    error,
    refetch: query.refetch,
  };
};
