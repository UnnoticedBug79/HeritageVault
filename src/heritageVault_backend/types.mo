import Time "mo:base/Time";
import Principal "mo:base/Principal";

module {
  // User types
  public type User = {
    id : Nat;
    principal : Principal;
    username : Text;
    email : ?Text;
    artifacts : [Nat];
    hasSubscription : Bool;
    subscriptionExpiry : ?Time.Time;
    createdAt : Time.Time;
  };
  
  // Artifact types
  public type ArtifactType = {
    #batik;
    #tenun;
    #ukiran;
    #patung;
    #other;
  };
  
  public type ArtifactMetadata = {
    creationDate : ?Text;
    artist : ?Text;
    materials : [Text];
    technique : ?Text;
    dimensions : ?Text;
    location : ?Text;
    culturalSignificance : ?Text;
    provenance : ?Text;
    additionalInfo : ?Text;
  };
  
  public type Artifact = {
    id : Nat;
    owner : Principal;
    name : Text;
    description : Text;
    artifactType : ArtifactType;
    ipfsUrl : Text;
    verificationHash : Text;
    metadataHash : Text;
    isVerified : Bool;
    metadata : ArtifactMetadata;
    mintedAsNFT : Bool;
    tokenId : ?Nat;
    createdAt : Time.Time;
    verifiedAt : ?Time.Time;
  };
  
  // Subscription types
  public type SubscriptionPlan = {
    #monthly;
    #yearly;
  };
  
  public type Subscription = {
    id : Nat;
    userId : Nat;
    userPrincipal : Principal;
    planId : Text;
    startDate : Time.Time;
    expiryDate : Time.Time;
    isActive : Bool;
    createdAt : Time.Time;
  };
  
  // NFT types
  public type NFTMetadata = {
    name : Text;
    description : Text;
    artifactType : ArtifactType;
    ipfsUrl : Text;
    verificationHash : Text;
    metadataHash : Text;
    originalArtifactId : Nat;
    createdAt : Time.Time;
  };
  
  // Statistics type
  public type Stats = {
    totalArtifacts : Nat;
    verifiedArtifacts : Nat;
    totalUsers : Nat;
    totalSubscriptions : Nat;
  };
}
