import React, { useState } from "react";
import { useAnnouncements } from "@/contexts/AnnouncementContext";
import { AnnouncementStatus, Announcement } from "@/types";
import AnnouncementList from "@/components/announcements/AnnouncementList";
import AnnouncementDetails from "@/components/announcements/AnnouncementDetails";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DesignerPage: React.FC = () => {
  const {
    isLoading,
    updateAnnouncement,
    getAnnouncementsByStatus,
  } = useAnnouncements();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleEditAnnouncement = (announcement: Announcement) => {
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
        <h1 className="text-3xl font-bold tracking-tight">Criar Anúncios</h1>
        <p className="text-muted-foreground">
          Visualize novas solicitações e trabalhe nos anúncios pendentes
        </p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">
            Pendentes ({pendingAnnouncements.length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            Em Produção ({inProgressAnnouncements.length})
          </TabsTrigger>
          <TabsTrigger value="awaiting">
            Aguardando ({awaitingApprovalAnnouncements.length})
          </TabsTrigger>
          <TabsTrigger value="published">
            Publicados ({publishedAnnouncements.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <AnnouncementList
            announcements={pendingAnnouncements}
            title="Anúncios Pendentes"
            onEdit={handleEditAnnouncement}
            showViewButton={false}
            showEditButton={true}
          />
        </TabsContent>
        <TabsContent value="in-progress">
          <AnnouncementList
            announcements={inProgressAnnouncements}
            title="Anúncios em Produção"
            onEdit={handleEditAnnouncement}
            showViewButton={false}
            showEditButton={true}
          />
        </TabsContent>
        <TabsContent value="awaiting">
          <AnnouncementList
            announcements={awaitingApprovalAnnouncements}
            title="Aguardando Aprovação"
            onEdit={handleEditAnnouncement}
            showViewButton={false}
            showEditButton={true}
          />
        </TabsContent>
        <TabsContent value="published">
          <AnnouncementList
            announcements={publishedAnnouncements}
            title="Anúncios Publicados"
            onEdit={handleEditAnnouncement}
            showViewButton={false}
            showEditButton={true}
          />
        </TabsContent>
      </Tabs>

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

export default DesignerPage;
