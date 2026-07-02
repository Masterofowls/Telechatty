const streamApiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY ?? '';
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.EXPO_PUBLIC_SUPABASE_KEY ??
  '';
const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8081';

export const env = {
  streamApiKey,
  supabaseUrl,
  supabaseAnonKey,
  apiUrl,
};

export function hasStreamConfig(): boolean {
  return streamApiKey.length > 0;
}

export function hasSupabaseConfig(): boolean {
  return supabaseUrl.length > 0 && supabaseAnonKey.length > 0;
}

export function hasDatabaseConfig(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function hasRequiredConfig(): boolean {
  return hasStreamConfig() && hasSupabaseConfig();
}
