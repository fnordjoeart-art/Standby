import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

export interface StoredFile {
  id: string;
  fileName: string;
  mimeType: string;
  uri: string; // Capacitor file URI
}

/**
 * Save a file to persistent storage
 * Works both on native (iOS/Android) and web
 */
export async function saveFileToPersistentStorage(
  file: File,
  id: string
): Promise<StoredFile> {
  const isNative = Capacitor.isNativePlatform();

  if (isNative) {
    // Native: Use Capacitor Filesystem
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          const base64Data = (reader.result as string).split(',')[1];
          
          const fileName = `${id}.${getFileExtension(file.name)}`;
          
          await Filesystem.writeFile({
            path: `backgrounds/${fileName}`,
            data: base64Data,
            directory: Directory.Data,
          });

          // Get the file URI
          const fileUri = await Filesystem.getUri({
            path: `backgrounds/${fileName}`,
            directory: Directory.Data,
          });

          resolve({
            id,
            fileName,
            mimeType: file.type,
            uri: Capacitor.convertFileSrc(fileUri.uri),
          });
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  } else {
    // Web: Use IndexedDB
    return saveToIndexedDB(file, id);
  }
}

/**
 * Load all stored files
 */
export async function loadStoredFiles(): Promise<StoredFile[]> {
  const isNative = Capacitor.isNativePlatform();

  if (isNative) {
    try {
      // List all files in backgrounds directory
      const result = await Filesystem.readdir({
        path: 'backgrounds',
        directory: Directory.Data,
      });

      const files: StoredFile[] = [];
      
      for (const file of result.files) {
        if (file.type === 'file') {
          const fileUri = await Filesystem.getUri({
            path: `backgrounds/${file.name}`,
            directory: Directory.Data,
          });

          const id = file.name.split('.')[0];
          const extension = getFileExtension(file.name);
          
          files.push({
            id,
            fileName: file.name,
            mimeType: getMimeType(extension),
            uri: Capacitor.convertFileSrc(fileUri.uri),
          });
        }
      }

      return files;
    } catch (error) {
      // Directory doesn't exist yet
      console.log('No stored files found');
      return [];
    }
  } else {
    // Web: Load from IndexedDB
    return loadFromIndexedDB();
  }
}

/**
 * Delete a stored file
 */
export async function deleteStoredFile(fileName: string): Promise<void> {
  const isNative = Capacitor.isNativePlatform();

  if (isNative) {
    await Filesystem.deleteFile({
      path: `backgrounds/${fileName}`,
      directory: Directory.Data,
    });
  } else {
    await deleteFromIndexedDB(fileName);
  }
}

/**
 * Initialize storage (create directories if needed)
 */
export async function initializeStorage(): Promise<void> {
  const isNative = Capacitor.isNativePlatform();

  if (isNative) {
    try {
      await Filesystem.mkdir({
        path: 'backgrounds',
        directory: Directory.Data,
        recursive: true,
      });
    } catch (error) {
      // Directory already exists
    }
  } else {
    // Initialize IndexedDB
    await initIndexedDB();
  }
}

// ========== INDEXEDDB FUNCTIONS (WEB ONLY) ==========

const DB_NAME = 'StandByPlusStorage';
const STORE_NAME = 'backgrounds';
const DB_VERSION = 1;

function initIndexedDB(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

async function saveToIndexedDB(file: File, id: string): Promise<StoredFile> {
  const reader = new FileReader();
  
  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      try {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction([STORE_NAME], 'readwrite');
          const store = transaction.objectStore(STORE_NAME);
          
          const data = {
            id,
            fileName: file.name,
            mimeType: file.type,
            data: reader.result as string,
          };
          
          store.put(data);
          
          transaction.oncomplete = () => {
            resolve({
              id,
              fileName: file.name,
              mimeType: file.type,
              uri: reader.result as string,
            });
          };
          
          transaction.onerror = () => reject(transaction.error);
        };
        
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function loadFromIndexedDB(): Promise<StoredFile[]> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => {
        const files = getAllRequest.result.map((item: any) => ({
          id: item.id,
          fileName: item.fileName,
          mimeType: item.mimeType,
          uri: item.data,
        }));
        resolve(files);
      };
      
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
    
    request.onerror = () => reject(request.error);
  });
}

async function deleteFromIndexedDB(fileName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      // Find by fileName and delete
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => {
        const item = getAllRequest.result.find((i: any) => i.fileName === fileName);
        if (item) {
          store.delete(item.id);
        }
      };
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    };
    
    request.onerror = () => reject(request.error);
  });
}

// ========== UTILITY FUNCTIONS ==========

function getFileExtension(fileName: string): string {
  return fileName.split('.').pop()?.toLowerCase() || '';
}

function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'webp': 'image/webp',
    'gif': 'image/gif',
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'mov': 'video/quicktime',
  };
  return mimeTypes[extension] || 'application/octet-stream';
}
