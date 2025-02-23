import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Only store non-sensitive data in Supabase
export const serverSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(1, "Server name is required"),
    host: z.string().min(1, "Hostname is required"),
    port: z.number().int().min(1).max(65535).default(22),
    username: z.string().min(1, "Username is required"),
    privateKey: z.string().min(1, "Private key is required"),
});

export type Server = z.infer<typeof serverSchema>;

// Local storage key
const SERVERS_STORAGE_KEY = 'serverer:servers';

// Get servers from local storage
export function getLocalServers(): Server[] {
    const stored = localStorage.getItem(SERVERS_STORAGE_KEY);
    if (!stored) return [];
    try {
        return JSON.parse(stored);
    } catch {
        return [];
    }
}

// Save servers to local storage
export function saveLocalServers(servers: Server[]) {
    localStorage.setItem(SERVERS_STORAGE_KEY, JSON.stringify(servers));
}

// Add a new server
export async function addServer(server: Omit<Server, 'id'>) {
    // Generate a UUID for the server
    const id = crypto.randomUUID();
    const newServer = { ...server, id };

    // Save to local storage
    const servers = getLocalServers();
    servers.push(newServer);
    saveLocalServers(servers);

    return newServer;
}

// Update a server
export async function updateServer(id: string, server: Partial<Server>) {
    const servers = getLocalServers();
    const index = servers.findIndex(s => s.id === id);

    if (index === -1) {
        throw new Error('Server not found');
    }

    const updatedServer = { ...servers[index], ...server };
    servers[index] = updatedServer;
    saveLocalServers(servers);


    return updatedServer;
}

// Delete a server
export async function deleteServer(id: string) {
    const servers = getLocalServers();
    const filtered = servers.filter(s => s.id !== id);
    saveLocalServers(filtered);
}

// Get a single server by ID
export function getServer(id: string): Server | undefined {
    return getLocalServers().find(s => s.id === id);
}