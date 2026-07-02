import { useCallback } from 'react';

import { fetchStreamToken } from '@/lib/api/stream';

export function useStreamTokenProvider() {
  return useCallback(async () => fetchStreamToken(), []);
}
