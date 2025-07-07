import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AnnouncementProvider } from "@/contexts/AnnouncementContext";

import AppLayout from "@/components/layout/AppLayout";
import LoginPage from "@/pages/LoginPage";
import Dashboard from "@/pages/Dashboard";
import DirectorPage from "@/pages/DirectorPage";
import DesignerPage from "@/pages/DesignerPage";
import CreateUserPage from "@/pages/CreateUserPage";
import SettingsPage from "@/pages/SettingsPage";
import DisplayPage from "@/pages/DisplayPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AnnouncementProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/display" element={<DisplayPage />} />
              <Route path="/" element={<AppLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="director" element={<DirectorPage />} />
                <Route path="designer" element={<DesignerPage />} />
                <Route path="create-user" element={<CreateUserPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AnnouncementProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
