import Text "mo:base/Text";
import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Nat8 "mo:base/Nat8";
import SHA256 "mo:sha256/SHA256";

module {
  
  // Convert text to Blob
  private func textToBlob(t : Text) : Blob {
    let bytes = Text.encodeUtf8(t);
    Blob.fromArray(Blob.toArray(bytes));
  };
  
  // Convert Blob to hexadecimal string
  private func blobToHex(blob : Blob) : Text {
    let bytes = Blob.toArray(blob);
    let hexChars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
    
    var result = "";
    for (byte in bytes.vals()) {
      let high = byte / 16;
      let low = byte % 16;
      result := result # hexChars[high] # hexChars[low];
    };
    
    result;
  };
  
  // Generate a hash from artifact data
  public func generateHash(name : Text, description : Text, ipfsUrl : Text) : Text {
    let combinedData = name # "|" # description # "|" # ipfsUrl;
    let dataBlob = textToBlob(combinedData);
    let hashBlob = SHA256.sha256(Blob.toArray(dataBlob));
    blobToHex(Blob.fromArray(hashBlob));
  };
  
  // Generate a hash from metadata
  public func generateMetadataHash(metadata : Any) : Text {
    // In a real implementation, we would serialize the metadata to JSON
    // and then hash it. For demo purposes, we'll use a simple string representation.
    let metadataStr = debug_show(metadata);
    let dataBlob = textToBlob(metadataStr);
    let hashBlob = SHA256.sha256(Blob.toArray(dataBlob));
    blobToHex(Blob.fromArray(hashBlob));
  };
  
  // Verify an artifact's hash
  public func verifyHash(
    name : Text,
    description : Text,
    ipfsUrl : Text,
    storedHash : Text
  ) : Bool {
    let generatedHash = generateHash(name, description, ipfsUrl);
    generatedHash == storedHash;
  };
  
  // Verify metadata hash
  public func verifyMetadataHash(metadata : Any, storedHash : Text) : Bool {
    let generatedHash = generateMetadataHash(metadata);
    generatedHash == storedHash;
  };
}
