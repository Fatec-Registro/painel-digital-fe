
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Wrench, FileImage, RefreshCw } from "lucide-react";

const SettingsPage: React.FC = () => {
  const { toast } = useToast();
  const [carouselSpeed, setCarouselSpeed] = React.useState(5);
  const [defaultDuration, setDefaultDuration] = React.useState(10);
  const [refreshRate, setRefreshRate] = React.useState(60);

  const handleSaveDisplaySettings = () => {
    localStorage.setItem("displaySettings", JSON.stringify({
      carouselSpeed,
      defaultDuration,
      refreshRate
    }));
    
    toast({
      title: "Configurações salvas",
      description: "As configurações do display foram atualizadas com sucesso.",
    });
  };

  const handleResetSystem = () => {
    localStorage.removeItem("announcements");
    
    toast({
      title: "Sistema reiniciado",
      description: "Todos os anúncios foram removidos do sistema.",
      variant: "destructive",
    });

    // Reload the page to reflect changes
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações do sistema de painéis digitais
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileImage className="h-5 w-5 text-university-primary" />
              <CardTitle>Configurações do Display</CardTitle>
            </div>
            <CardDescription>
              Configure como os anúncios são exibidos nos painéis digitais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="carouselSpeed">
                Velocidade da Transição (segundos)
              </Label>
              <Input
                id="carouselSpeed"
                type="number"
                min="1"
                max="10"
                value={carouselSpeed}
                onChange={(e) => setCarouselSpeed(parseInt(e.target.value) || 5)}
              />
              <p className="text-xs text-muted-foreground">
                Define a velocidade da transição entre anúncios
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultDuration">
                Duração Padrão de Exibição (segundos)
              </Label>
              <Input
                id="defaultDuration"
                type="number"
                min="5"
                max="30"
                value={defaultDuration}
                onChange={(e) => setDefaultDuration(parseInt(e.target.value) || 10)}
              />
              <p className="text-xs text-muted-foreground">
                Tempo padrão que cada anúncio fica visível
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="refreshRate">
                Taxa de Atualização (segundos)
              </Label>
              <Input
                id="refreshRate"
                type="number"
                min="30"
                max="300"
                value={refreshRate}
                onChange={(e) => setRefreshRate(parseInt(e.target.value) || 60)}
              />
              <p className="text-xs text-muted-foreground">
                Intervalo para verificar por novos anúncios
              </p>
            </div>

            <Button onClick={handleSaveDisplaySettings} className="w-full">
              Salvar Configurações
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-university-primary" />
              <CardTitle>Manutenção do Sistema</CardTitle>
            </div>
            <CardDescription>
              Opções avançadas para manutenção e restauração do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="mb-2 font-semibold">Reiniciar Sistema</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Esta opção remove todos os anúncios e reinicia o sistema para o estado inicial.
                Esta ação não pode ser desfeita.
              </p>
              <Button 
                variant="destructive" 
                className="w-full gap-2"
                onClick={handleResetSystem}
              >
                <RefreshCw className="h-4 w-4" />
                Reiniciar Sistema
              </Button>
            </div>

            <Separator />

            <div>
              <h3 className="mb-2 font-semibold">Informações do Sistema</h3>
              <div className="space-y-2 rounded-md bg-muted p-4 text-sm">
                <p><strong>Versão:</strong> 1.0.0</p>
                <p><strong>Última Atualização:</strong> {new Date().toLocaleDateString()}</p>
                <p><strong>Status do Sistema:</strong> <span className="text-university-success">Operacional</span></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
