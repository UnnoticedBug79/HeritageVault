import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import PinataSDK from '@pinata/sdk';
import FormData from 'form-data';
import { log } from './vite';

// IPFS configuration
const pinata = new PinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_API_SECRET
);

async function testAuthentication() {
  try {
    const result = await pinata.testAuthentication();
    log(`✅ IPFS: Pinata connected successfully: ${result.authenticated}`, 'ipfs');
    return result.authenticated;
  } catch (err) {
    log(`❌ IPFS: Pinata authentication failed: ${err}`, 'ipfs');
    return false;
  }
}

// Test connection on startup
testAuthentication();

/**
 * Upload file ke IPFS menggunakan Pinata
 * @param filePath Path file yang akan diupload
 * @param fileName Nama file (opsional)
 * @param metadata Metadata tambahan
 * @returns IPFS CID dan URL gateway
 */
export async function uploadToIPFS(
  filePath: string,
  fileName?: string,
  metadata?: Record<string, any>
): Promise<{ cid: string; url: string; metadataHash: string }> {
  try {
    // Prepare metadata
    const metadataObject = {
      name: fileName || path.basename(filePath),
      keyvalues: metadata || {}
    };
    
    // Calculate metadata hash
    const metadataHash = generateMetadataHash(metadataObject.keyvalues);
    
    // Upload file to IPFS
    const readableStreamForFile = fs.createReadStream(filePath);
    const pinataResponse = await pinata.pinFileToIPFS(readableStreamForFile, {
      pinataMetadata: metadataObject
    });
    
    // Construct IPFS URL
    const cid = pinataResponse.IpfsHash;
    const url = `https://gateway.pinata.cloud/ipfs/${cid}`;
    
    log(`✅ IPFS: File uploaded to ${url}`, 'ipfs');
    return { cid, url, metadataHash };
  } catch (error) {
    log(`❌ IPFS: Upload failed: ${error}`, 'ipfs');
    throw new Error(`Failed to upload to IPFS: ${error.message}`);
  }
}

/**
 * Upload buffer ke IPFS menggunakan Pinata
 * @param buffer Buffer data yang akan diupload
 * @param fileName Nama file (opsional)
 * @param metadata Metadata tambahan
 * @returns IPFS CID dan URL gateway
 */
export async function uploadBufferToIPFS(
  buffer: Buffer,
  fileName: string,
  metadata?: Record<string, any>
): Promise<{ cid: string; url: string; metadataHash: string }> {
  try {
    // Create form data for Pinata
    const formData = new FormData();
    formData.append('file', buffer, {
      filename: fileName
    });
    
    // Prepare metadata
    const metadataObject = {
      name: fileName,
      keyvalues: metadata || {}
    };
    
    // Calculate metadata hash
    const metadataHash = generateMetadataHash(metadataObject.keyvalues);
    
    // Add metadata to form
    formData.append('pinataMetadata', JSON.stringify(metadataObject));
    
    // Upload to Pinata
    const pinataResponse = await pinata.pinFileToIPFS(formData);
    
    // Construct IPFS URL
    const cid = pinataResponse.IpfsHash;
    const url = `https://gateway.pinata.cloud/ipfs/${cid}`;
    
    log(`✅ IPFS: Buffer uploaded to ${url}`, 'ipfs');
    return { cid, url, metadataHash };
  } catch (error) {
    log(`❌ IPFS: Buffer upload failed: ${error}`, 'ipfs');
    throw new Error(`Failed to upload buffer to IPFS: ${error.message}`);
  }
}

/**
 * Generate metadata hash untuk sistem verifikasi
 * @param metadata Objek metadata
 * @returns Hash metadata dalam format hex
 */
export function generateMetadataHash(metadata: Record<string, any>): string {
  const metadataStr = JSON.stringify(metadata);
  return crypto.createHash('sha256').update(metadataStr).digest('hex');
}

/**
 * Generate verification hash kombinasi dari metadata + image data
 * @param metadata Objek metadata
 * @param imagePath Path ke file gambar
 * @returns Hash verifikasi dalam format hex
 */
export async function generateVerificationHash(
  metadata: Record<string, any>,
  imagePath: string
): Promise<string> {
  try {
    // Read image data
    const imageData = fs.readFileSync(imagePath);
    
    // Combine metadata and image data
    const metadataStr = JSON.stringify(metadata);
    const combinedData = metadataStr + imageData.toString('base64');
    
    // Generate hash
    return crypto.createHash('sha256').update(combinedData).digest('hex');
  } catch (error) {
    log(`❌ IPFS: Verification hash generation failed: ${error}`, 'ipfs');
    throw new Error(`Failed to generate verification hash: ${error.message}`);
  }
}
