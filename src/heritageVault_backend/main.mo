import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Debug "mo:base/Debug";
import Error "mo:base/Error";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";

import Types "./types";
import Verification "./verification";
import Token "./token";

actor HeritageVault {
  
  // Type aliases for readability
  type User = Types.User;
  type Artifact = Types.Artifact;
  type ArtifactMetadata = Types.ArtifactMetadata;
  type SubscriptionPlan = Types.SubscriptionPlan;
  type Subscription = Types.Subscription;
  type NFTMetadata = Types.NFTMetadata;
  type Stats = Types.Stats;
  
  // Data structures
  private stable var nextUserId : Nat = 1;
  private stable var nextArtifactId : Nat = 1;
  private stable var nextSubscriptionId : Nat = 1;
  private stable var nextTokenId : Nat = 1;
  
  private var users = HashMap.HashMap<Principal, User>(10, Principal.equal, Principal.hash);
  private var artifacts = HashMap.HashMap<Nat, Artifact>(10, Nat.equal, Hash.hash);
  private var subscriptions = HashMap.HashMap<Principal, Subscription>(10, Principal.equal, Principal.hash);
  private var tokens = Token.init(); // NFT token registry
  
  // Stats for dashboard
  private stable var stats : Stats = {
    totalArtifacts = 0;
    verifiedArtifacts = 0;
    totalUsers = 0;
    totalSubscriptions = 0;
  };
  
  // ========== USER MANAGEMENT ==========
  
  // Get or create a user profile
  public shared(msg) func getOrCreateUser() : async User {
    let caller = msg.caller;
    
    switch (users.get(caller)) {
      case (?user) {
        return user;
      };
      case (null) {
        let newUser : User = {
          id = nextUserId;
          principal = caller;
          username = Option.get(Principal.toText(caller), "anonymous");
          email = null;
          artifacts = [];
          hasSubscription = false;
          subscriptionExpiry = null;
          createdAt = Time.now();
        };
        
        users.put(caller, newUser);
        nextUserId += 1;
        stats.totalUsers += 1;
        
        return newUser;
      };
    };
  };
  
  // Get the current user's profile
  public shared(msg) func getUser() : async ?User {
    let caller = msg.caller;
    users.get(caller);
  };
  
  // Update user profile
  public shared(msg) func updateUser(username : ?Text, email : ?Text) : async Result.Result<User, Text> {
    let caller = msg.caller;
    
    switch (users.get(caller)) {
      case (?user) {
        let updatedUser : User = {
          id = user.id;
          principal = user.principal;
          username = Option.get(username, user.username);
          email = Option.get(email, user.email);
          artifacts = user.artifacts;
          hasSubscription = user.hasSubscription;
          subscriptionExpiry = user.subscriptionExpiry;
          createdAt = user.createdAt;
        };
        
        users.put(caller, updatedUser);
        #ok(updatedUser);
      };
      case (null) {
        #err("User not found");
      };
    };
  };
  
  // ========== ARTIFACT MANAGEMENT ==========
  
  // Create a new artifact
  public shared(msg) func createArtifact(
    name : Text,
    description : Text,
    artifactType : Types.ArtifactType,
    ipfsUrl : Text,
    metadata : ArtifactMetadata
  ) : async Result.Result<Artifact, Text> {
    let caller = msg.caller;
    
    switch (users.get(caller)) {
      case (?user) {
        // Generate verification hash using the verification module
        let verificationHash = Verification.generateHash(name, description, ipfsUrl);
        let metadataHash = Verification.generateMetadataHash(metadata);
        
        let newArtifact : Artifact = {
          id = nextArtifactId;
          owner = caller;
          name = name;
          description = description;
          artifactType = artifactType;
          ipfsUrl = ipfsUrl;
          verificationHash = verificationHash;
          metadataHash = metadataHash;
          isVerified = false;
          metadata = metadata;
          mintedAsNFT = false;
          tokenId = null;
          createdAt = Time.now();
          verifiedAt = null;
        };
        
        artifacts.put(nextArtifactId, newArtifact);
        
        // Update user's artifacts
        let updatedArtifacts = Array.append<Nat>([nextArtifactId], user.artifacts);
        let updatedUser : User = {
          id = user.id;
          principal = user.principal;
          username = user.username;
          email = user.email;
          artifacts = updatedArtifacts;
          hasSubscription = user.hasSubscription;
          subscriptionExpiry = user.subscriptionExpiry;
          createdAt = user.createdAt;
        };
        
        users.put(caller, updatedUser);
        
        nextArtifactId += 1;
        stats.totalArtifacts += 1;
        
        #ok(newArtifact);
      };
      case (null) {
        #err("User not found. Please create an account first.");
      };
    };
  };
  
  // Get all artifacts
  public query func getAllArtifacts() : async [Artifact] {
    Iter.toArray(artifacts.vals());
  };
  
  // Get a specific artifact
  public query func getArtifact(id : Nat) : async ?Artifact {
    artifacts.get(id);
  };
  
  // Get artifacts owned by the current user
  public shared(msg) func getMyArtifacts() : async [Artifact] {
    let caller = msg.caller;
    
    switch (users.get(caller)) {
      case (?user) {
        let userArtifacts = Buffer.Buffer<Artifact>(user.artifacts.size());
        
        for (artifactId in user.artifacts.vals()) {
          switch (artifacts.get(artifactId)) {
            case (?artifact) {
              userArtifacts.add(artifact);
            };
            case (null) {};
          };
        };
        
        Buffer.toArray(userArtifacts);
      };
      case (null) {
        [];
      };
    };
  };
  
  // Verify an artifact
  public shared(msg) func verifyArtifact(id : Nat) : async Result.Result<Artifact, Text> {
    let caller = msg.caller;
    
    switch (artifacts.get(id)) {
      case (?artifact) {
        // In a real-world scenario, we would perform actual verification here
        // For demo purposes, we'll just mark it as verified
        
        let updatedArtifact : Artifact = {
          id = artifact.id;
          owner = artifact.owner;
          name = artifact.name;
          description = artifact.description;
          artifactType = artifact.artifactType;
          ipfsUrl = artifact.ipfsUrl;
          verificationHash = artifact.verificationHash;
          metadataHash = artifact.metadataHash;
          isVerified = true;
          metadata = artifact.metadata;
          mintedAsNFT = artifact.mintedAsNFT;
          tokenId = artifact.tokenId;
          createdAt = artifact.createdAt;
          verifiedAt = ?Time.now();
        };
        
        artifacts.put(id, updatedArtifact);
        stats.verifiedArtifacts += 1;
        
        #ok(updatedArtifact);
      };
      case (null) {
        #err("Artifact not found");
      };
    };
  };
  
  // ========== NFT FUNCTIONALITY ==========
  
  // Mint an artifact as NFT
  public shared(msg) func mintNFT(artifactId : Nat) : async Result.Result<Nat, Text> {
    let caller = msg.caller;
    
    switch (artifacts.get(artifactId)) {
      case (?artifact) {
        if (artifact.owner != caller) {
          return #err("You don't own this artifact");
        };
        
        if (artifact.mintedAsNFT) {
          return #err("This artifact is already minted as NFT");
        };
        
        if (not artifact.isVerified) {
          return #err("Artifact must be verified before minting");
        };
        
        // Prepare NFT metadata
        let nftMetadata : NFTMetadata = {
          name = artifact.name;
          description = artifact.description;
          artifactType = artifact.artifactType;
          ipfsUrl = artifact.ipfsUrl;
          verificationHash = artifact.verificationHash;
          metadataHash = artifact.metadataHash;
          originalArtifactId = artifactId;
          createdAt = Time.now();
        };
        
        // Mint NFT
        let tokenId = Token.mint(tokens, caller, nftMetadata);
        
        // Update artifact
        let updatedArtifact : Artifact = {
          id = artifact.id;
          owner = artifact.owner;
          name = artifact.name;
          description = artifact.description;
          artifactType = artifact.artifactType;
          ipfsUrl = artifact.ipfsUrl;
          verificationHash = artifact.verificationHash;
          metadataHash = artifact.metadataHash;
          isVerified = artifact.isVerified;
          metadata = artifact.metadata;
          mintedAsNFT = true;
          tokenId = ?tokenId;
          createdAt = artifact.createdAt;
          verifiedAt = artifact.verifiedAt;
        };
        
        artifacts.put(artifactId, updatedArtifact);
        
        #ok(tokenId);
      };
      case (null) {
        #err("Artifact not found");
      };
    };
  };
  
  // Get NFT tokens owned by the current user
  public shared(msg) func getUserTokens() : async [Token.NFT] {
    let caller = msg.caller;
    Token.getTokensByOwner(tokens, caller);
  };
  
  // Transfer NFT to another user
  public shared(msg) func transferNFT(tokenId : Nat, to : Principal) : async Result.Result<(), Text> {
    let caller = msg.caller;
    Token.transfer(tokens, caller, to, tokenId);
  };
  
  // ========== SUBSCRIPTION MANAGEMENT ==========
  
  // Create a subscription
  public shared(msg) func createSubscription(planId : Text) : async Result.Result<Subscription, Text> {
    let caller = msg.caller;
    
    switch (users.get(caller)) {
      case (?user) {
        // Determine subscription duration based on plan
        let durationNanos = switch (planId) {
          case ("monthly") 30 * 24 * 60 * 60 * 1000000000; // 30 days in nanoseconds
          case ("yearly") 365 * 24 * 60 * 60 * 1000000000; // 365 days in nanoseconds
          case (_) return #err("Invalid subscription plan");
        };
        
        let now = Time.now();
        let expiry = now + durationNanos;
        
        let newSubscription : Subscription = {
          id = nextSubscriptionId;
          userId = user.id;
          userPrincipal = caller;
          planId = planId;
          startDate = now;
          expiryDate = expiry;
          isActive = true;
          createdAt = now;
        };
        
        subscriptions.put(caller, newSubscription);
        
        // Update user
