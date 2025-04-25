import Principal "mo:base/Principal";
import Option "mo:base/Option";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Types "./types";
import Verification "./verification";
import Token "./token";

actor {
  // Types
  type User = Types.User;
  type Artifact = Types.Artifact;
  type CreateArtifactRequest = Types.CreateArtifactRequest;
  type VerificationResult = Types.VerificationResult;

  // Storage
  private stable var nextArtifactId : Nat = 1;
  private stable var nextUserId : Nat = 1;
  
  private let artifacts = HashMap.HashMap<Nat, Artifact>(0, Nat.equal, Text.hash);
  private let users = HashMap.HashMap<Principal, User>(0, Principal.equal, Principal.hash);
  
  // User functions
  public shared(msg) func createUser(username : Text) : async Nat {
    let caller = msg.caller;
    
    // Check if user already exists
    switch (users.get(caller)) {
      case (?existingUser) {
        return existingUser.id;
      };
      case null {
        let id = nextUserId;
        let newUser : User = {
          id = id;
          principal = caller;
          username = username;
          createdAt = Nat64.fromNat(Int.abs(Time.now()));
        };
        
        users.put(caller, newUser);
        nextUserId += 1;
        return id;
      };
    };
  };
  
  public shared query(msg) func getMyUser() : async ?User {
    return users.get(msg.caller);
  };
  
  // Artifact functions
  public shared(msg) func createArtifact(request : CreateArtifactRequest) : async Nat {
    // Get caller's user or create one
    let userId = await createUser(Option.get(request.creatorUsername, "anonymous"));
    
    let artifactId = nextArtifactId;
    
    // Generate verification hash for the artifact content
    let verificationHash = Verification.generateHashForArtifact(request.name, request.description, request.origin);
    
    // Generate metadata hash for additional properties
    let metadataHash = Verification.generateHashForMetadata(request.artistName, request.creationDate, request.category);
    
    let newArtifact : Artifact = {
      id = artifactId;
      name = request.name;
      description = request.description;
      origin = request.origin;
      creatorId = userId;
      creatorPrincipal = msg.caller;
      artifactType = request.artifactType;
      imageUrl = request.imageUrl;
      verified = false;
      tokenId = null;
      verificationHash = verificationHash;
      metadataHash = metadataHash;
      createdAt = Nat64.fromNat(Int.abs(Time.now()));
    };
    
    artifacts.put(artifactId, newArtifact);
    nextArtifactId += 1;
    
    return artifactId;
  };
  
  public query func getArtifact(id : Nat) : async ?Artifact {
    return artifacts.get(id);
  };
  
  public query func getAllArtifacts() : async [Artifact] {
    return Iter.toArray(artifacts.vals());
  };
  
  // Verification functions
  public shared(msg) func verifyArtifact(id : Nat) : async VerificationResult {
    switch (artifacts.get(id)) {
      case null {
        return {
          success = false;
          message = "Artifact not found";
          artifact = null;
        };
      };
      case (?artifact) {
        // Perform verification checks
        let contentVerified = Verification.verifyContent(
          artifact.name, 
          artifact.description, 
          artifact.origin, 
          artifact.verificationHash
        );
        
        if (not contentVerified) {
          return {
            success = false;
            message = "Content verification failed. Artifact may have been modified.";
            artifact = null;
          };
        };
        
        // Create NFT token for the verified artifact
        let tokenId = await Token.mintNFT(msg.caller, artifact.id, artifact.name, artifact.imageUrl);
        
        // Update artifact with verification status and token
        let updatedArtifact : Artifact = {
          id = artifact.id;
          name = artifact.name;
          description = artifact.description;
          origin = artifact.origin;
          creatorId = artifact.creatorId;
          creatorPrincipal = artifact.creatorPrincipal;
          artifactType = artifact.artifactType;
          imageUrl = artifact.imageUrl;
          verified = true;
          tokenId = ?tokenId;
          verificationHash = artifact.verificationHash;
          metadataHash = artifact.metadataHash;
          createdAt = artifact.createdAt;
        };
        
        artifacts.put(id, updatedArtifact);
        
        return {
          success = true;
          message = "Artifact successfully verified and NFT minted";
          artifact = ?updatedArtifact;
        };
      };
    };
  };
  
  // Admin functions
  public shared(msg) func clearAll() : async () {
    // Only allow this in development environments
    assert(Principal.isAnonymous(msg.caller) == false);
    
    artifacts.clear();
    users.clear();
    nextArtifactId := 1;
    nextUserId := 1;
  };
}
