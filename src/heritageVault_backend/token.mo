import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";

import Types "./types";

module {
  public type NFTMetadata = Types.NFTMetadata;
  
  public type NFT = {
    tokenId : Nat;
    owner : Principal;
    metadata : NFTMetadata;
    minted : Time.Time;
  };
  
  public type TokenRegistry = {
    // Map from token ID to NFT
    tokens : HashMap.HashMap<Nat, NFT>;
    // Map from owner to their token IDs
    ownerTokens : HashMap.HashMap<Principal, [Nat]>;
  };
  
  public func init() : TokenRegistry {
    {
      tokens = HashMap.HashMap<Nat, NFT>(10, Nat.equal, Hash.hash);
      ownerTokens = HashMap.HashMap<Principal, [Nat]>(10, Principal.equal, Principal.hash);
    };
  };
  
  // Mint a new NFT
  public func mint(registry : TokenRegistry, owner : Principal, metadata : NFTMetadata) : Nat {
    // Generate token ID (in real-world we would use a more sophisticated approach)
    var tokenId = registry.tokens.size() + 1;
    
    // Create NFT
    let nft : NFT = {
      tokenId = tokenId;
      owner = owner;
      metadata = metadata;
      minted = Time.now();
    };
    
    // Add to registry
    registry.tokens.put(tokenId, nft);
    
    // Update owner's tokens
    let ownerTokens = Option.get(registry.ownerTokens.get(owner), []);
    let updatedOwnerTokens = Array.append<Nat>([tokenId], ownerTokens);
    registry.ownerTokens.put(owner, updatedOwnerTokens);
    
    tokenId;
  };
  
  // Get an NFT by token ID
  public func getToken(registry : TokenRegistry, tokenId : Nat) : ?NFT {
    registry.tokens.get(tokenId);
  };
  
  // Get all NFTs owned by a principal
  public func getTokensByOwner(registry : TokenRegistry, owner : Principal) : [NFT] {
    let tokenIds = Option.get(registry.ownerTokens.get(owner), []);
    let buffer = Buffer.Buffer<NFT>(tokenIds.size());
    
    for (tokenId in tokenIds.vals()) {
      switch (registry.tokens.get(tokenId)) {
        case (?nft) {
          buffer.add(nft);
        };
        case (null) {};
      };
    };
    
    Buffer.toArray(buffer);
  };
  
  // Transfer an NFT to another owner
  public func transfer(
    registry : TokenRegistry,
    from : Principal,
    to : Principal,
    tokenId : Nat
  ) : Result.Result<(), Text> {
    switch (registry.tokens.get(tokenId)) {
      case (?nft) {
        if (nft.owner != from) {
          return #err("Not the owner of this NFT");
        };
        
        // Update NFT ownership
        let updatedNFT : NFT = {
          tokenId = nft.tokenId;
          owner = to;
          metadata = nft.metadata;
          minted = nft.minted;
        };
        
        registry.tokens.put(tokenId, updatedNFT);
        
        // Update from's tokens
        let fromTokens = Option.get(registry.ownerTokens.get(from), []);
        let updatedFromTokens = Array.filter<Nat>(fromTokens, func(id) { id != tokenId });
        registry.ownerTokens.put(from, updatedFromTokens);
        
        // Update to's tokens
        let toTokens = Option.get(registry.ownerTokens.get(to), []);
        let updatedToTokens = Array.append<Nat>([tokenId], toTokens);
        registry.ownerTokens.put(to, updatedToTokens);
        
        #ok(());
      };
      case (null) {
        #err("NFT not found");
      };
    };
  };
  
  // Burn an NFT
  public func burn(
    registry : TokenRegistry,
    owner : Principal,
    tokenId : Nat
  ) : Result.Result<(), Text> {
    switch (registry.tokens.get(tokenId)) {
      case (?nft) {
        if (nft.owner != owner) {
          return #err("Not the owner of this NFT");
        };
        
        // Remove from tokens
        registry.tokens.delete(tokenId);
        
        // Update owner's tokens
        let ownerTokens = Option.get(registry.ownerTokens.get(owner), []);
        let updatedOwnerTokens = Array.filter<Nat>(ownerTokens, func(id) { id != tokenId });
        registry.ownerTokens.put(owner, updatedOwnerTokens);
        
        #ok(());
      };
      case (null) {
        #err("NFT not found");
      };
    };
  };
}
