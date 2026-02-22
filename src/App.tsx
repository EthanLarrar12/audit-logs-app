import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { ShadowRootContext } from "@/lib/shadow-Root-Context";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = ({ basename = "/", shadowContainer }: { basename?: string, shadowContainer?: HTMLElement }) => (
  <ShadowRootContext.Provider value={shadowContainer || null}>
    <div className="audit-logs-wrapper h-full w-full flex-1 flex flex-col min-h-0">
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
  </ShadowRootContext.Provider>
);

export default App;
