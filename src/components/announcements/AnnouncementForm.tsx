
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnnouncementFormData } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, File, X } from "lucide-react";

interface AnnouncementFormProps {
  onSubmit: (data: AnnouncementFormData) => void;
  isLoading: boolean;
}

const formSchema = z.object({
  title: z.string().min(5, "O título deve ter pelo menos 5 caracteres"),
  description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres"),
});

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    // Ensure data strictly conforms to AnnouncementFormData type
    const formData: AnnouncementFormData = {
      title: data.title,
      description: data.description,
      briefingPdf: selectedFile || undefined,
    };
    onSubmit(formData);
    form.reset();
    setSelectedFile(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else if (file) {
      alert("Por favor, selecione apenas arquivos PDF.");
      event.target.value = "";
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    const fileInput = document.getElementById("pdf-upload") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitar Novo Anúncio</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do Anúncio</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Semana de Boas-vindas" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição do Anúncio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva os detalhes que devem estar contidos na arte gráfica..."
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <FormLabel>Briefing em PDF (Opcional)</FormLabel>
              <p className="text-sm text-muted-foreground">
                Envie um briefing em PDF com as informações necessárias para a criação da arte
              </p>
              
              {!selectedFile ? (
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Clique para selecionar um arquivo PDF
                  </p>
                  <input
                    id="pdf-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("pdf-upload")?.click()}
                  >
                    Selecionar PDF
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <File className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{selectedFile.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Enviando..." : "Enviar Solicitação"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AnnouncementForm;