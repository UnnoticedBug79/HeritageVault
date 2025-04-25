import React from 'react';
import { Switch, Route } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { queryClient } from '@/lib/queryClient';

// Pages
import Home from '@/pages/Home';
import UploadArtifact from '@/pages/UploadArtifact';
import VerifyArtifact from '@/pages/VerifyArtifact';
import ViewArtifact from '@/pages/ViewArtifact';
import NotFound from '@/pages/not-found';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/upload" component={UploadArtifact} />
      <Route path="/verify" component={VerifyArtifact} />
      <Route path="/artifact/:id" component={ViewArtifact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background bg-gradient-to-b from-background to-background/90">
        <Router />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
