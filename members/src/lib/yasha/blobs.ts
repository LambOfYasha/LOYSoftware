const blobs = new Map<string, Blob>();

export function putBlob(id: string, blob: Blob) {
  blobs.set(id, blob);
}

export function getBlob(id: string) {
  return blobs.get(id);
}

export function dropBlob(id: string) {
  blobs.delete(id);
}
