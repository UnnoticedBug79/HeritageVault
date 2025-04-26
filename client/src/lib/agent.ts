import { Actor, HttpAgent, ActorSubclass, Identity } from "@dfinity/agent";
import { idlFactory } from "../../declarations/heritageVault_backend/heritageVault_backend.did.js";
import { getIdentity } from "./auth";

export type CanisterId = string;

export interface HeritageVaultActor {
  getOrCreateUser: () => Promise<any>;
  createArtifact: (arg: any) => Promise<any>;
  getArtifact: (id: bigint) => Promise<any>;
  getAllArtifacts: () => Promise<any>;
  getMyArtifacts: () => Promise<any>;
  verifyArtifact: (id: bigint) => Promise<any>;
  mintNFT: (arg: any) => Promise<any>;
  createSubscription: (planId: string) => Promise<any>;
  getMySubscription: () => Promise<any>;
  getStats: () => Promise<any>;
}

// Store canister IDs
const canisterIds = {
  heritageVault_backend: process.env.CANISTER_ID_HERITAGEVAULT_BACKEND || "rrkah-fqaaa-aaaaa-aaaaq-cai"
};

// Store actor instances for reuse
let actorCache: { [key: string]: ActorSubclass<any> } = {};

export async function getAgent(): Promise<HttpAgent> {
  const identity = await getIdentity();
  
  const agent = new HttpAgent({
    identity,
    host: process.env.DFX_NETWORK === "ic" 
      ? "https://ic0.app" 
      : "http://localhost:8000"
  });
  
  // When in development (local), fetch root key
  if (process.env.DFX_NETWORK !== "ic") {
    await agent.fetchRootKey();
  }
  
  return agent;
}

export async function createActor<T>(
  canisterId: CanisterId,
  idlFactory: any,
  identity?: Identity
): Promise<ActorSubclass<T>> {
  const agent = await getAgent();
  
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });
}

export async function getHeritageVaultActor(): Promise<ActorSubclass<HeritageVaultActor>> {
  const canisterId = canisterIds.heritageVault_backend;
  return createActor<HeritageVaultActor>(canisterId, idlFactory);
}

export async function getCachedHeritageVaultActor(): Promise<ActorSubclass<HeritageVaultActor>> {
  const canisterId = canisterIds.heritageVault_backend;
  
  if (!actorCache[canisterId]) {
    actorCache[canisterId] = await getHeritageVaultActor();
  }
  
  return actorCache[canisterId] as ActorSubclass<HeritageVaultActor>;
}

export function resetActorCache(): void {
  actorCache = {};
}
