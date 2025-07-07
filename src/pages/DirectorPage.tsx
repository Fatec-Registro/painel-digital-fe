
import React, { useState } from "react";
import { useAnnouncements } from "@/contexts/AnnouncementContext";
import { AnnouncementStatus, Announcement, AnnouncementFormData } from "@/types";
import AnnouncementForm from "@/components/announcements/AnnouncementForm";
import AnnouncementList from "@/components/announcements/AnnouncementList";
import AnnouncementDetails from "@/components/announcements/AnnouncementDetails";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DirectorPage: React.FC = () => {
  const {
    announcements,
    isLoading,
    createAnnouncement,
    updateAnnouncement,
    getAnnouncementsByStatus,
  } = useAnnouncements();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleCreateAnnouncement = async (data: AnnouncementFormData) => {
    try {
      await createAnnouncement(data);
    } catch (error) {
      console.error("Failed to create announcement:", error);
    }
  };

  const handleViewAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setDetailsOpen(true);
  };

  const handleStatusChange = async (id: string, status: AnnouncementStatus) => {
    try {
      await updateAnnouncement(id, { status });
      if (selectedAnnouncement && selectedAnnouncement.id === id) {
        setSelectedAnnouncement({
          ...selectedAnnouncement,
          status,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleImageUpload = async (id: string, imageUrl: string) => {
    try {
      await updateAnnouncement(id, { imageUrl });
      if (selectedAnnouncement && selectedAnnouncement.id === id) {
        setSelectedAnnouncement({
          ...selectedAnnouncement,
          imageUrl,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Failed to upload image:", error);
    }
  };

  const handleDurationChange = async (id: string, displayDuration: number) => {
    try {
      await updateAnnouncement(id, { displayDuration });
      if (selectedAnnouncement && selectedAnnouncement.id === id) {
        setSelectedAnnouncement({
          ...selectedAnnouncement,
          displayDuration,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Failed to update duration:", error);
    }
  };

  const pendingAnnouncements = getAnnouncementsByStatus(AnnouncementStatus.PENDING);
  const inProgressAnnouncements = getAnnouncementsByStatus(AnnouncementStatus.IN_PROGRESS);
  const awaitingApprovalAnnouncements = getAnnouncementsByStatus(AnnouncementStatus.AWAITING_APPROVAL);
  const publishedAnnouncements = getAnnouncementsByStatus(AnnouncementStatus.PUBLISHED);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gerenciar Anúncios</h1>
        <p className="text-muted-foreground">
          Solicite novos anúncios e acompanhe o status das suas solicitações
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <AnnouncementForm onSubmit={handleCreateAnnouncement} isLoading={isLoading} />

        <Tabs defaultValue="awaiting" className="h-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="awaiting">
              Aguardando ({awaitingApprovalAnnouncements.length})
            </TabsTrigger>
            <TabsTrigger value="in-progress">
              Em Produção ({inProgressAnnouncements.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pendentes ({pendingAnnouncements.length})
            </TabsTrigger>
            <TabsTrigger value="published">
              Publicados ({publishedAnnouncements.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="awaiting" className="h-full">
            <AnnouncementList
              announcements={awaitingApprovalAnnouncements}
              title="Aguardando Aprovação"
              onView={handleViewAnnouncement}
            />
          </TabsContent>
          <TabsContent value="in-progress" className="h-full">
            <AnnouncementList
              announcements={inProgressAnnouncements}
              title="Em Produção"
              onView={handleViewAnnouncement}
            />
          </TabsContent>
          <TabsContent value="pending" className="h-full">
            <AnnouncementList
              announcements={pendingAnnouncements}
              title="Pendentes"
              onView={handleViewAnnouncement}
            />
          </TabsContent>
          <TabsContent value="published" className="h-full">
            <AnnouncementList
              announcements={publishedAnnouncements}
              title="Publicados"
              onView={handleViewAnnouncement}
            />
          </TabsContent>
        </Tabs>
      </div>

      <AnnouncementDetails
        announcement={selectedAnnouncement}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onStatusChange={handleStatusChange}
        onImageUpload={handleImageUpload}
        onDurationChange={handleDurationChange}
      />
    </div>
  );
};

export default DirectorPage;
