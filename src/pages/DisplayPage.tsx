
import React, { useState, useEffect, useCallback } from "react";
import { useAnnouncements } from "@/contexts/AnnouncementContext";
import { Announcement } from "@/types";
import { Card } from "@/components/ui/card";
import { FileImage, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const DisplayPage: React.FC = () => {
  const { getPublishedAnnouncements, deleteAnnouncement } = useAnnouncements();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const getDisplaySettings = () => {
    const defaultSettings = {
      carouselSpeed: 5,
      defaultDuration: 10,
      refreshRate: 60,
    };

    const savedSettings = localStorage.getItem("displaySettings");
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  };

  const settings = getDisplaySettings();

  const loadAnnouncements = useCallback(() => {
    const publishedAnnouncements = getPublishedAnnouncements();
    if (publishedAnnouncements.length > 0) {
      setAnnouncements(publishedAnnouncements);
      // Reset to first announcement if the current index is out of bounds
      if (currentIndex >= publishedAnnouncements.length) {
        setCurrentIndex(0);
      }
    }
  }, [getPublishedAnnouncements, currentIndex]);

  // Load announcements initially and set up periodic refresh
  useEffect(() => {
    loadAnnouncements();
    
    const refreshInterval = setInterval(() => {
      loadAnnouncements();
    }, settings.refreshRate * 1000);
    
    return () => clearInterval(refreshInterval);
  }, [loadAnnouncements, settings.refreshRate]);

  // Handle carousel rotation
  useEffect(() => {
    if (announcements.length === 0) return;
    
    if (timer) {
      clearTimeout(timer);
    }
    
    const duration = announcements[currentIndex]?.displayDuration || settings.defaultDuration;
    
    const newTimer = window.setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === announcements.length - 1 ? 0 : prevIndex + 1
      );
    }, duration * 1000);
    
    setTimer(newTimer);
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [currentIndex, announcements, settings.defaultDuration]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable fullscreen: ${e.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      await deleteAnnouncement(id);
      
      // Update the local state after deletion
      const updatedAnnouncements = announcements.filter(ann => ann.id !== id);
      setAnnouncements(updatedAnnouncements);
      
      // Adjust current index if needed
      if (currentIndex >= updatedAnnouncements.length) {
        setCurrentIndex(Math.max(0, updatedAnnouncements.length - 1));
      }
      
      toast.success("Anúncio excluído com sucesso");
      setConfirmDeleteId(null);
    } catch (error) {
      console.error("Erro ao excluir anúncio:", error);
      toast.error("Erro ao excluir anúncio");
    }
  };

  if (announcements.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-university-background">
        <div className="text-center">
          <FileImage className="mx-auto mb-4 h-16 w-16 text-university-primary opacity-50" />
          <h1 className="text-2xl font-bold text-university-primary">Nenhum anúncio publicado</h1>
          <p className="mt-2 text-muted-foreground">
            Não há anúncios disponíveis para exibição no momento.
          </p>
        </div>
      </div>
    );
  }

  const currentAnnouncement = announcements[currentIndex];
  const duration = currentAnnouncement?.displayDuration || settings.defaultDuration;

  return (
    <div className="relative min-h-screen bg-black">
      {/* Fullscreen toggle button */}
      <button
        onClick={toggleFullscreen}
        className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
      >
        {isFullscreen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8V5a2 2 0 0 1 2-2h3M8 21H5a2 2 0 0 1-2-2v-3m18 0v3a2 2 0 0 1-2 2h-3M21 8V5a2 2 0 0 1-2-2h-3" />
          </svg>
        )}
      </button>

      {/* Timer display */}
      <div className="absolute left-4 top-4 z-10 flex items-center gap-1 rounded-full bg-black/50 px-3 py-1 text-white">
        <Clock className="h-4 w-4" />
        <span className="text-sm">{duration}s</span>
      </div>

      {/* Delete button */}
      <AlertDialog open={!!confirmDeleteId} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            size="sm"
            className="absolute right-4 top-16 z-10 rounded-full bg-red-500/70 hover:bg-red-500"
            onClick={() => setConfirmDeleteId(currentAnnouncement.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este anúncio? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => confirmDeleteId && handleDeleteAnnouncement(confirmDeleteId)}
              className="bg-red-500 hover:bg-red-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Display carousel navigation */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {announcements.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-8 rounded-full ${
              currentIndex === index ? "bg-white" : "bg-white/30"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>

      {/* Main carousel display */}
      <div className="relative flex h-screen w-full items-center justify-center bg-black">
        <div className="h-full w-full">
          {currentAnnouncement.imageUrl ? (
            <img
              src={currentAnnouncement.imageUrl}
              alt={currentAnnouncement.title}
              className="h-full w-full object-contain"
            />
          ) : (
            <Card className="flex h-full w-full flex-col items-center justify-center p-10">
              <FileImage className="mb-4 h-24 w-24 text-muted-foreground" />
              <h2 className="text-2xl font-bold">{currentAnnouncement.title}</h2>
              <p className="mt-4 max-w-2xl text-center text-muted-foreground">
                {currentAnnouncement.description}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayPage;
