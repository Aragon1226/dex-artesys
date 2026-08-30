import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

function createCloudFetch(apiKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== 'undefined' && input instanceof Request ? input.headers : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    if (apiKey.startsWith('sb_publishable_') && headers.get('Authorization') === `Bearer ${apiKey}`) {
      headers.delete('Authorization');
    }

    headers.set('apikey', apiKey);
    return fetch(input, { ...init, headers });
  };
}

function createCloudClient() {
  const url = import.meta.env['VITE_SUPABASE_URL'] || process.env['SUPABASE_URL'];
  const publishableKey = import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'] || process.env['SUPABASE_PUBLISHABLE_KEY'];

  if (!url || !publishableKey) {
    throw new Error('The Artesys backend connection is not configured.');
  }

  return createClient<Database>(url, publishableKey, {
    global: { fetch: createCloudFetch(publishableKey) },
    auth: {
      storage: typeof window === 'undefined' ? undefined : window.localStorage,
      storageKey: 'artesys-auth-session',
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

let cloudClient: ReturnType<typeof createCloudClient> | undefined;

export const supabase = new Proxy({} as ReturnType<typeof createCloudClient>, {
  get(_, property, receiver) {
    cloudClient ??= createCloudClient();
    return Reflect.get(cloudClient, property, receiver);
  },
});