
import React from "react";
import { useAnnouncements } from "@/contexts/AnnouncementContext";
import StatCard from "@/components/dashboard/StatCard";
import RecentAnnouncements from "@/components/dashboard/RecentAnnouncements";
import { AlertCircle, CheckCircle, ClipboardList, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AnnouncementStatus, UserRole } from "@/types";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { getDashboardStats, isLoading } = useAnnouncements();
  const stats = getDashboardStats();

  const getRoleBasedWelcomeMessage = () => {
    if (!user) return "Bem-vindo ao Sistema";
    
    switch (user.role) {
      case UserRole.DIRECTOR:
        return "Bem-vindo, Diretor";
      case UserRole.DESIGNER:
        return "Bem-vindo, Designer";
      case UserRole.ADMIN:
        return "Bem-vindo, Administrador";
      default:
        return "Bem-vindo ao Sistema";
    }
  };

  const getRoleBasedDescription = () => {
    if (!user) return "";
    
    switch (user.role) {
      case UserRole.DIRECTOR:
        return "Gerencie e solicite novos anúncios para os painéis digitais.";
      case UserRole.DESIGNER:
        return "Visualize e trabalhe nas solicitações de anúncios.";
      case UserRole.ADMIN:
        return "Gerencie o sistema e monitore todas as atividades.";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{getRoleBasedWelcomeMessage()}</h1>
        <p className="text-muted-foreground">{getRoleBasedDescription()}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Anúncios"
          value={stats.total}
          icon={ClipboardList}
          iconColor="text-university-gray"
        />
        <StatCard
          title="Pendentes"
          value={stats.pending}
          icon={AlertCircle}
          iconColor="text-primary"
        />
        <StatCard
          title="Em Produção"
          value={stats.inProgress}
          icon={Clock}
          iconColor="text-university-warning"
        />
        <StatCard
          title="Publicados"
          value={stats.published}
          icon={CheckCircle}
          iconColor="text-university-success"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <RecentAnnouncements announcements={stats.recentAnnouncements} />
      </div>
    </div>
  );
};

export default Dashboard;
