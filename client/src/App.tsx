import React from 'react';
import { Route, Switch } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import Home from './pages/Home';
import UploadArtifact from './pages/UploadArtifact';
import ViewArtifact from './pages/ViewArtifact';
import VerifyArtifact from './pages/VerifyArtifact';
import MetaversePage from './pages/MetaversePage';
import NotFound from './pages/not-found';
import { Toaster } from './components/ui/toaster';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/upload" component={UploadArtifact} />
      <Route path="/artifact/:id" component={ViewArtifact} />
      <Route path="/verify/:id" component={VerifyArtifact} />
      <Route path="/metaverse" component={MetaversePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;
