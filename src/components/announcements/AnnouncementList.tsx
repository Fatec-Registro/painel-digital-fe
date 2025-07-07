
import React from "react";
import { Announcement } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/ui/status-badge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Eye, Edit } from "lucide-react";

interface AnnouncementListProps {
  announcements: Announcement[];
  title: string;
  onView?: (announcement: Announcement) => void;
  onEdit?: (announcement: Announcement) => void;
  showViewButton?: boolean;
  showEditButton?: boolean;
}

const AnnouncementList: React.FC<AnnouncementListProps> = ({
  announcements,
  title,
  onView,
  onEdit,
  showViewButton = true,
  showEditButton = false,
}) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {announcements.length === 0 ? (
            <p className="text-center text-muted-foreground">Nenhum anúncio encontrado</p>
          ) : (
            announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="rounded-lg border p-4 shadow-sm"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-semibold">{announcement.title}</h3>
                  <StatusBadge status={announcement.status} />
                </div>
                <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                  {announcement.description}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    Atualizado {formatDistanceToNow(new Date(announcement.updatedAt), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </p>
                  <div className="flex gap-2">
                    {showViewButton && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView && onView(announcement)}
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        Visualizar
                      </Button>
                    )}
                    {showEditButton && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onEdit && onEdit(announcement)}
                      >
                        <Edit className="mr-1 h-4 w-4" />
                        Editar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnnouncementList;
