import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
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
