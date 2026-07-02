import { Redirect } from 'expo-router';

import { hasRequiredConfig } from '@/lib/env';
import { routes } from '@/lib/routes';
import { useAuth } from '@/providers/AuthProvider';

export default function IndexScreen() {
  const { session } = useAuth();

  if (!hasRequiredConfig()) {
    return <Redirect href={routes.setup} />;
  }

  if (!session) {
    return <Redirect href={routes.login} />;
  }

  return <Redirect href={routes.tabs} />;
}
