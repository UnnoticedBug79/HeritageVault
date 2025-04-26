import { AuthClient } from "@dfinity/auth-client";
import { Identity } from "@dfinity/agent";
import { resetActorCache } from "./agent";

let authClient: AuthClient | null = null;

export async function getAuthClient(): Promise<AuthClient> {
  if (!authClient) {
    authClient = await AuthClient.create();
  }
  return authClient;
}

export async function isAuthenticated(): Promise<boolean> {
  const client = await getAuthClient();
  return await client.isAuthenticated();
}

export async function getIdentity(): Promise<Identity | undefined> {
  const client = await getAuthClient();
  return client.getIdentity();
}

export async function login(): Promise<boolean> {
  const client = await getAuthClient();
  
  return new Promise((resolve) => {
    client.login({
      identityProvider: process.env.DFX_NETWORK === "ic" 
        ? "https://identity.ic0.app"
        : "http://localhost:8000?canisterId=rdmx6-jaaaa-aaaaa-aaadq-cai",
      onSuccess: () => {
        resetActorCache();
        resolve(true);
      },
      onError: (error) => {
        console.error("Login failed", error);
        resolve(false);
      },
    });
  });
}

export async function logout(): Promise<void> {
  const client = await getAuthClient();
  await client.logout();
  resetActorCache();
}

export async function getPrincipal(): Promise<string | undefined> {
  const client = await getAuthClient();
  if (await client.isAuthenticated()) {
    const identity = client.getIdentity();
    const principal = identity.getPrincipal();
    return principal.toString();
  }
  return undefined;
}
