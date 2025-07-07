
import React from "react";
import { Announcement } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/ui/status-badge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface RecentAnnouncementsProps {
  announcements: Announcement[];
}

const RecentAnnouncements: React.FC<RecentAnnouncementsProps> = ({
  announcements,
}) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Anúncios Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {announcements.length === 0 ? (
            <p className="text-center text-muted-foreground">Nenhum anúncio encontrado</p>
          ) : (
            announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="flex items-center justify-between border-b pb-4 last:border-0"
              >
                <div className="space-y-1">
                  <p className="font-semibold line-clamp-1">{announcement.title}</p>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={announcement.status} />
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(announcement.updatedAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                </div>
                {announcement.imageUrl && (
                  <div className="h-12 w-12 overflow-hidden rounded-md">
                    <img
                      src={announcement.imageUrl}
                      alt={announcement.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentAnnouncements;
