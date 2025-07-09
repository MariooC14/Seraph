export const fakeWindowHosts: typeof window.hosts = {
  add: async host => {
    console.log('Adding host:', host);
    return { success: true, data: { ...host, id: host.id } };
  },
  getAll: async () => {
    return { success: true, data: [] };
  },
  get: async () => {
    return { success: true, data: undefined };
  },
  remove: async () => {
    return { success: true, data: undefined };
  }
};
