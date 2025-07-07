
import React from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Settings, 
  FileImage, 
  ListTodo, 
  LogOut,
  User,
  UserPlus
} from "lucide-react";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const AppLayout: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-lg font-medium text-primary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login due to the effect above
  }

  // Navigation links based on user role
  const getNavLinks = () => {
    const links = [
      {
        name: "Dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
        href: "/dashboard",
        roles: [UserRole.ADMIN, UserRole.DIRECTOR, UserRole.DESIGNER],
      },
    ];

    if (user.role === UserRole.DIRECTOR) {
      links.push({
        name: "Request Announcements",
        icon: <ListTodo className="h-5 w-5" />,
        href: "/director",
        roles: [UserRole.DIRECTOR],
      });
    }

    if (user.role === UserRole.DESIGNER) {
      links.push({
        name: "Design Announcements",
        icon: <FileImage className="h-5 w-5" />,
        href: "/designer",
        roles: [UserRole.DESIGNER],
      });
    }

    if (user.role === UserRole.ADMIN) {
      links.push(
        {
          name: "Criar Usuário",
          icon: <UserPlus className="h-5 w-5" />,
          href: "/create-user",
          roles: [UserRole.ADMIN],
        },
        {
          name: "Settings",
          icon: <Settings className="h-5 w-5" />,
          href: "/settings",
          roles: [UserRole.ADMIN],
        }
      );
    }

    return links;
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col bg-card shadow-md">
        <div className="flex h-16 items-center gap-2 px-5 mt-5 mb-5">
          <div className="rounded-md bg-primary p-2">
            <FileImage className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Painel Digital</h1>
        </div>
        
        <Separator />
        
        <nav className="flex-1 py-5">
          <ul className="space-y-2">
            {getNavLinks().map((link) => (
              <li key={link.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 hover:bg-accent/20 text-foreground [&>svg]:text-foreground"
                  onClick={() => navigate(link.href)}
                >
                  {link.icon}
                  {link.name}
                </Button>
              </li>
            ))}
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 hover:bg-accent/20 text-foreground [&>svg]:text-foreground"
                onClick={() => window.open("/display", "_blank")}
              >
                <FileImage className="h-5 w-5" />
                View Display
              </Button>
            </li>
          </ul>
        </nav>
        
        <Separator />
        
        <div className="p-4">
          <div className="flex items-center gap-3 rounded-md bg-background p-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <User className="h-5 w-5" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground capitalize">{user.role}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
