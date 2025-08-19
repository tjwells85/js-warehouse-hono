import { createAuthClient } from 'better-auth/react';
import { passkeyClient } from 'better-auth/client/plugins';
import { adminClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
	baseURL: import.meta.env.PUBLIC_AUTH_HOST,
	plugins: [passkeyClient(), adminClient()],
});

export const { signIn, signOut, getSession, useSession, passkey } = authClient;
