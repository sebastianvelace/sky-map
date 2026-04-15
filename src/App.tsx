import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";
import { useHistoryStorage } from "./hooks/useHistoryStorage";

const queryClient = new QueryClient();
const Index = lazy(() => import("./pages/Index"));
const History = lazy(() => import("./pages/History"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AppContent = () => {
  const { count } = useHistoryStorage();
  
  return (
    <>
      <Navbar historyCount={count} />
      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-24">
            <LoadingSpinner />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/history" element={<History />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
