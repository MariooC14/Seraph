"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { serverSchema, type ServerFormData } from "@/lib/validations/server";
// import { addServer } from "@/lib/server";

export function AddServerDialog() {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ServerFormData>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      port: 22,
    },
  });

  const onSubmit = async (/*data: ServerFormData*/) => {
    toast.error("Add server not implemented yet.");
    // try {
    //   await addServer(data);
    //   setOpen(false);
    //   reset();
    //   toast.success("Server added successfully.");
    // } catch (error) {
    //   toast.error("Failed to add server.");
    // }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Server
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add New Server</DialogTitle>
            <DialogDescription>
              Add a new server to manage. Make sure you have SSH access to the
              server.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Server Name</Label>
              <Input
                id="name"
                placeholder="Production Server"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="host">Hostname</Label>
              <Input
                id="host"
                placeholder="example.com"
                {...register("host")}
              />
              {errors.host && (
                <p className="text-sm text-destructive">
                  {errors.host.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                type="number"
                {...register("port", { valueAsNumber: true })}
              />
              {errors.port && (
                <p className="text-sm text-destructive">
                  {errors.port.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="root"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-sm text-destructive">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="privateKey">Private Key</Label>
              <Textarea
                id="privateKey"
                placeholder="-----BEGIN RSA PRIVATE KEY-----"
                className="font-mono"
                {...register("privateKey")}
              />
              {errors.privateKey && (
                <p className="text-sm text-destructive">
                  {errors.privateKey.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Server"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
