
import React from "react";
import { cn } from "@/lib/utils";
import { AnnouncementStatus } from "@/types";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: AnnouncementStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusConfig = (status: AnnouncementStatus) => {
    switch (status) {
      case AnnouncementStatus.PENDING:
        return {
          label: "Pendente",
          variant: "outline" as const,
          className: "border-university-gray text-university-gray",
        };
      case AnnouncementStatus.IN_PROGRESS:
        return {
          label: "Em Produção",
          variant: "outline" as const,
          className: "border-university-warning text-university-warning",
        };
      case AnnouncementStatus.AWAITING_APPROVAL:
        return {
          label: "Aguardando Aprovação",
          variant: "outline" as const,
          className: "border-university-primary text-university-primary",
        };
      case AnnouncementStatus.PUBLISHED:
        return {
          label: "Publicado",
          variant: "outline" as const,
          className: "border-university-success text-university-success",
        };
      default:
        return {
          label: "Desconhecido",
          variant: "outline" as const,
          className: "border-muted-foreground text-muted-foreground",
        };
    }
  };

  const statusConfig = getStatusConfig(status);

  return (
    <Badge
      variant={statusConfig.variant}
      className={cn(statusConfig.className, className)}
    >
      {statusConfig.label}
    </Badge>
  );
};

export default StatusBadge;
