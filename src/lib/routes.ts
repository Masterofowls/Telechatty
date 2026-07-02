import type { Href } from 'expo-router';

export const routes = {
  setup: '/setup' as Href,
  login: '/auth/login' as Href,
  tabs: '/home/tabs' as Href,
  users: '/home/users' as Href,
  channel: (cid: string) => `/home/channel/${cid}` as Href,
};
