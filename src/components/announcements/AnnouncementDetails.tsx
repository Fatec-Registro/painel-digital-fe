
import React, { useState } from "react";
import { Announcement, AnnouncementStatus, UserRole } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import StatusBadge from "@/components/ui/status-badge";
import { formatDistanceToNow, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/contexts/AuthContext";
import { Label } from "@/components/ui/label";
import { ArrowUp, ArrowDown } from "lucide-react";

interface AnnouncementDetailsProps {
  announcement: Announcement | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (id: string, status: AnnouncementStatus) => void;
  onImageUpload: (id: string, imageUrl: string) => void;
  onDurationChange: (id: string, duration: number) => void;
}

// Define the status hierarchy
const statusHierarchy = [
  AnnouncementStatus.PENDING,
  AnnouncementStatus.IN_PROGRESS,
  AnnouncementStatus.AWAITING_APPROVAL,
  AnnouncementStatus.PUBLISHED,
];

// Helper functions to get next and previous status
const getNextStatus = (currentStatus: AnnouncementStatus): AnnouncementStatus | null => {
  const currentIndex = statusHierarchy.indexOf(currentStatus);
  if (currentIndex < statusHierarchy.length - 1) {
    return statusHierarchy[currentIndex + 1];
  }
  return null;
};

const getPrevStatus = (currentStatus: AnnouncementStatus): AnnouncementStatus | null => {
  const currentIndex = statusHierarchy.indexOf(currentStatus);
  if (currentIndex > 0) {
    return statusHierarchy[currentIndex - 1];
  }
  return null;
};

const AnnouncementDetails: React.FC<AnnouncementDetailsProps> = ({
  announcement,
  open,
  onOpenChange,
  onStatusChange,
  onImageUpload,
  onDurationChange,
}) => {
  const { user } = useAuth();
  const [imageUrl, setImageUrl] = useState("");
  const [displayDuration, setDisplayDuration] = useState<number>(5);

  if (!announcement) return null;

  const formattedDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const handleImageSubmit = () => {
    if (imageUrl && announcement) {
      onImageUpload(announcement.id, imageUrl);
      setImageUrl("");
    }
  };

  const handleDurationSubmit = () => {
    if (announcement && displayDuration) {
      onDurationChange(announcement.id, displayDuration);
    }
  };

  // Determine which actions the current user can perform
  const canChangeStatus = !!user && (
    user.role === UserRole.ADMIN ||
    (user.role === UserRole.DESIGNER && announcement.status !== AnnouncementStatus.PUBLISHED) ||
    (user.role === UserRole.DIRECTOR && announcement.status === AnnouncementStatus.AWAITING_APPROVAL)
  );

  const canUploadImage = !!user && (
    user.role === UserRole.DESIGNER || 
    user.role === UserRole.ADMIN
  );

  const canSetDuration = !!user && (
    user.role === UserRole.DESIGNER || 
    user.role === UserRole.ADMIN
  ) && 
  announcement.imageUrl && 
  (announcement.status === AnnouncementStatus.AWAITING_APPROVAL || 
   announcement.status === AnnouncementStatus.PUBLISHED);

  // Check allowed status transitions based on user role
  const isNextStatusAllowed = (): boolean => {
    if (user?.role === UserRole.ADMIN) return true;
    
    if (user?.role === UserRole.DESIGNER) {
      if (announcement.status === AnnouncementStatus.PENDING || 
          announcement.status === AnnouncementStatus.IN_PROGRESS) {
        return true;
      }
      return false;
    }
    
    if (user?.role === UserRole.DIRECTOR) {
      if (announcement.status === AnnouncementStatus.AWAITING_APPROVAL) {
        return true;
      }
      return false;
    }
    
    return false;
  };

  const isPrevStatusAllowed = (): boolean => {
    if (user?.role === UserRole.ADMIN) return true;
    
    // Designers and directors typically wouldn't downgrade status
    // But you can modify this logic as needed for your use case
    return false;
  };

  // Get the next and previous status
  const nextStatus = getNextStatus(announcement.status);
  const prevStatus = getPrevStatus(announcement.status);

  // Check if buttons should be enabled
  const canMoveToNextStatus = isNextStatusAllowed() && nextStatus !== null;
  const canMoveToPrevStatus = isPrevStatusAllowed() && prevStatus !== null;

  const handleMoveStatusUp = () => {
    if (canMoveToNextStatus && nextStatus && announcement) {
      onStatusChange(announcement.id, nextStatus);
    }
  };

  const handleMoveStatusDown = () => {
    if (canMoveToPrevStatus && prevStatus && announcement) {
      onStatusChange(announcement.id, prevStatus);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {announcement.title}
          </DialogTitle>
          <div className="flex items-center gap-2 pt-1">
            <StatusBadge status={announcement.status} />
            <DialogDescription>
              Atualizado {formatDistanceToNow(new Date(announcement.updatedAt), {
                addSuffix: true,
                locale: ptBR,
              })}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Detalhes do Anúncio</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {announcement.description}
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">Criado em:</span>{" "}
                {formattedDate(announcement.createdAt)}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">Última atualização:</span>{" "}
                {formattedDate(announcement.updatedAt)}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">ID:</span> {announcement.id}
              </p>
              {announcement.displayDuration && (
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold">Duração de exibição:</span>{" "}
                  {announcement.displayDuration} segundos
                </p>
              )}
            </div>

            {canChangeStatus && (
              <>
                <Separator />
                <div className="space-y-2">
                  <Label>Alterar Status</Label>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleMoveStatusDown}
                      disabled={!canMoveToPrevStatus}
                      variant="outline"
                      size="sm"
                    >
                      <ArrowDown className="mr-1" />
                      Retroceder
                    </Button>
                    <Button 
                      onClick={handleMoveStatusUp}
                      disabled={!canMoveToNextStatus}
                      variant="default"
                      size="sm"
                    >
                      <ArrowUp className="mr-1" />
                      Avançar
                    </Button>
                  </div>
                </div>
              </>
            )}

            {canSetDuration && (
              <>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="duration">Duração de Exibição (segundos)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="duration"
                      type="number"
                      min="3"
                      max="30"
                      value={displayDuration}
                      onChange={(e) => setDisplayDuration(parseInt(e.target.value) || 5)}
                    />
                    <Button onClick={handleDurationSubmit}>
                      Definir
                    </Button>
                  </div>
                </div>
              </>
            )}
            
            {canUploadImage && (
              <>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">URL da Imagem</Label>
                  <div className="flex gap-2">
                    <Input
                      id="imageUrl"
                      placeholder="URL da imagem..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                    <Button onClick={handleImageSubmit} disabled={!imageUrl}>
                      Enviar
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Para exemplo: use URLs como 
                    https://source.unsplash.com/random/1200x800/?university
                  </p>
                </div>
              </>
            )}
          </div>
          
          <div className="space-y-4">
            {announcement.imageUrl ? (
              <div className="overflow-hidden rounded-md border">
                <img
                  src={announcement.imageUrl}
                  alt={announcement.title}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-md border border-dashed">
                <p className="text-sm text-muted-foreground">
                  Nenhuma imagem disponível
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnnouncementDetails;
