
import React from "react";
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
    };
    onSubmit(formData);
    form.reset();
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
