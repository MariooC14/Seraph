/*
import { createClient } from "./supabase/client";
import type { ServerFormData } from "./validations/server";

export async function addServer(data: ServerFormData) {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data: server, error } = await supabase
    .from("servers")
    .insert([
      {
        user_id: user.id,
        name: data.name,
        host: data.host,
        port: data.port,
        username: data.username,
        private_key: data.privateKey,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error(error.message);
    throw error;
  }
  return server;
}

export async function getServers() {
  const supabase = createClient();

  const { data: servers, error } = await supabase
    .from("servers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return servers;
}

export async function deleteServer(id: string) {
  const supabase = createClient();

  const { error } = await supabase.from("servers").delete().eq("id", id);

  if (error) throw error;
}

export async function connectToServer(server: {
  host: string;
  port: number;
  username: string;
  privateKey: string;
}) {
  if (typeof window === "undefined") {
    const { connectToServer } = await import("./server-side");
    return connectToServer(server);
  }
  throw new Error("connectToServer can only be called on the server");
}
*/
