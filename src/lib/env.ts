const streamApiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY ?? '';
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const env = {
  streamApiKey,
  supabaseUrl,
  supabaseAnonKey,
};

export function hasStreamConfig(): boolean {
  return streamApiKey.length > 0;
}

export function hasSupabaseConfig(): boolean {
  return supabaseUrl.length > 0 && supabaseAnonKey.length > 0;
}

export function hasRequiredConfig(): boolean {
  return hasStreamConfig() && hasSupabaseConfig();
}
