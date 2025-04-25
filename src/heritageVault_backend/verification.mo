import Text "mo:base/Text";
import Hash "mo:base/Hash";
import Blob "mo:base/Blob";
import SHA256 "./sha256";

module {
  // Generate a hash for artifact content verification
  public func generateHashForArtifact(name : Text, description : Text, origin : Text) : Text {
    let contentString = name # description # origin;
    
    // Convert string to Blob and compute SHA-256 hash
    let contentBlob = Text.encodeUtf8(contentString);
    let hashBlob = SHA256.sha256(contentBlob);
    
    // Convert hash to hexadecimal string
    return blobToHex(hashBlob);
  };
  
  // Generate a hash for metadata verification
  public func generateHashForMetadata(artistName : ?Text, creationDate : ?Text, category : ?Text) : Text {
    let artistStr = switch (artistName) {
      case null { "" };
      case (?val) { val };
    };
    
    let dateStr = switch (creationDate) {
      case null { "" };
      case (?val) { val };
    };
    
    let categoryStr = switch (category) {
      case null { "" };
      case (?val) { val };
    };
    
    let metadataString = artistStr # dateStr # categoryStr;
    
    // Convert string to Blob and compute SHA-256 hash
    let metadataBlob = Text.encodeUtf8(metadataString);
    let hashBlob = SHA256.sha256(metadataBlob);
    
    // Convert hash to hexadecimal string
    return blobToHex(hashBlob);
  };
  
  // Verify that content matches the stored hash
  public func verifyContent(name : Text, description : Text, origin : Text, storedHash : Text) : Bool {
    let computedHash = generateHashForArtifact(name, description, origin);
    return Text.equal(computedHash, storedHash);
