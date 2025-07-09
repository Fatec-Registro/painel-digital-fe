import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  Announcement, 
  AnnouncementStatus, 
  AnnouncementFormData, 
  UpdateAnnouncementData,
  DashboardStats
} from "@/types";
import { useAuth } from "./AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface AnnouncementContextType {
  announcements: Announcement[];
  isLoading: boolean;
  createAnnouncement: (data: AnnouncementFormData) => Promise<void>;
  updateAnnouncement: (id: string, data: UpdateAnnouncementData) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  getAnnouncementsByStatus: (status: AnnouncementStatus) => Announcement[];
  getDashboardStats: () => DashboardStats;
  getPublishedAnnouncements: () => Announcement[];
}

const AnnouncementContext = createContext<AnnouncementContextType | undefined>(undefined);

// Initial mock data
const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "1",
    title: "Welcome Week Events",
    description: "Create a poster with all the welcome week events for new students",
    status: AnnouncementStatus.PUBLISHED,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    requestedBy: "2", // Director
    assignedTo: "3", // Designer
    imageUrl: "https://source.unsplash.com/random/1200x800/?university,event",
    displayDuration: 8
  },
  {
    id: "2",
    title: "Library Hours Change",
    description: "Create an announcement for new library hours during exam period",
    status: AnnouncementStatus.AWAITING_APPROVAL,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    requestedBy: "2", // Director
    assignedTo: "3", // Designer
    imageUrl: "https://source.unsplash.com/random/1200x800/?library,study",
    displayDuration: 6
  },
  {
    id: "3",
    title: "Career Fair",
    description: "Design a poster for the upcoming career fair with all participating companies",
    status: AnnouncementStatus.IN_PROGRESS,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    requestedBy: "2", // Director
    assignedTo: "3", // Designer
  },
  {
    id: "4",
    title: "Sports Tournament",
    description: "Create graphics for the inter-college sports tournament",
    status: AnnouncementStatus.PENDING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    requestedBy: "2", // Director
  },
  {
    id: "5",
    title: "Graduation Ceremony",
    description: "Design poster for graduation ceremony with date, time and venue details",
    status: AnnouncementStatus.PUBLISHED,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    requestedBy: "2", // Director
    assignedTo: "3", // Designer
    imageUrl: "https://source.unsplash.com/random/1200x800/?graduation,ceremony",
    displayDuration: 7
  }
];

export const AnnouncementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Simulate API call to fetch data
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Check for saved announcements first
        const savedAnnouncements = localStorage.getItem("announcements");
        if (savedAnnouncements) {
          setAnnouncements(JSON.parse(savedAnnouncements));
        } else {
          setAnnouncements(MOCK_ANNOUNCEMENTS);
          localStorage.setItem("announcements", JSON.stringify(MOCK_ANNOUNCEMENTS));
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
        toast({
          title: "Error",
          description: "Failed to load announcements",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const createAnnouncement = async (data: AnnouncementFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (!user) throw new Error("You must be logged in to create an announcement");
      
      const newAnnouncement: Announcement = {
        id: Date.now().toString(),
        title: data.title,
        description: data.description,
        status: AnnouncementStatus.PENDING,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        requestedBy: user.id,
        // Simulate PDF storage - in real implementation, upload to your backend
        briefingPdfUrl: data.briefingPdf ? `mock-url/${data.briefingPdf.name}` : undefined,
        briefingPdfName: data.briefingPdf ? data.briefingPdf.name : undefined,
      };
      
      const updatedAnnouncements = [...announcements, newAnnouncement];
      setAnnouncements(updatedAnnouncements);
      localStorage.setItem("announcements", JSON.stringify(updatedAnnouncements));
      
      toast({
        title: "Announcement created",
        description: "Your request has been sent to designers",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create announcement",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateAnnouncement = async (id: string, data: UpdateAnnouncementData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (!user) throw new Error("You must be logged in to update an announcement");
      
      const updatedAnnouncements = announcements.map((announcement) => {
        if (announcement.id === id) {
          const updatedAnnouncement = {
            ...announcement,
            ...data,
            updatedAt: new Date().toISOString(),
          };
          
          // If status is being changed to IN_PROGRESS, assign it to the current designer
          if (data.status === AnnouncementStatus.IN_PROGRESS && user.role === "designer") {
            updatedAnnouncement.assignedTo = user.id;
          }
          
          return updatedAnnouncement;
        }
        return announcement;
      });
      
      setAnnouncements(updatedAnnouncements);
      localStorage.setItem("announcements", JSON.stringify(updatedAnnouncements));
      
      toast({
        title: "Announcement updated",
        description: "The announcement has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update announcement",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAnnouncement = async (id: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (!user) throw new Error("You must be logged in to delete an announcement");
      
      const updatedAnnouncements = announcements.filter((announcement) => announcement.id !== id);
      
      setAnnouncements(updatedAnnouncements);
      localStorage.setItem("announcements", JSON.stringify(updatedAnnouncements));
      
      toast({
        title: "Announcement deleted",
        description: "The announcement has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete announcement",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getAnnouncementsByStatus = (status: AnnouncementStatus) => {
    return announcements.filter((announcement) => announcement.status === status);
  };

  const getDashboardStats = (): DashboardStats => {
    const pending = announcements.filter(a => a.status === AnnouncementStatus.PENDING).length;
    const inProgress = announcements.filter(a => a.status === AnnouncementStatus.IN_PROGRESS).length;
    const awaitingApproval = announcements.filter(a => a.status === AnnouncementStatus.AWAITING_APPROVAL).length;
    const published = announcements.filter(a => a.status === AnnouncementStatus.PUBLISHED).length;
    
    // Sort by date for recent announcements
    const sortedAnnouncements = [...announcements].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    
    return {
      pending,
      inProgress,
      awaitingApproval,
      published,
      total: announcements.length,
      recentAnnouncements: sortedAnnouncements.slice(0, 5)
    };
  };

  const getPublishedAnnouncements = () => {
    return announcements.filter(
      (announcement) => announcement.status === AnnouncementStatus.PUBLISHED
    );
  };

  return (
    <AnnouncementContext.Provider
      value={{
        announcements,
        isLoading,
        createAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
        getAnnouncementsByStatus,
        getDashboardStats,
        getPublishedAnnouncements,
      }}
    >
      {children}
    </AnnouncementContext.Provider>
  );
};

export const useAnnouncements = () => {
  const context = useContext(AnnouncementContext);
  if (context === undefined) {
    throw new Error("useAnnouncements must be used within an AnnouncementProvider");
  }
  return context;
};