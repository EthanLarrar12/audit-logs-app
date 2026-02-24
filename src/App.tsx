import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";

import { styles } from "./App.styles";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <div className={styles.wrapper}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Routes>
            {/* A catch-all route ensures it ALWAYS renders inside the parent app, regardless of the parent's URL structure */}
            <Route path="*" element={<Index />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  </div>
);

export default App;
