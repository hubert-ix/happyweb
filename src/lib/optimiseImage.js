const SKIP = ['image/svg+xml', 'image/gif']; // vectors and animations: upload as-is

export async function optimiseImage(file, { maxWidth = 1000, maxHeight = 600, type = 'image/webp', quality = 0.8 } = {}) {
  if (!file.type.startsWith('image/') || SKIP.includes(file.type)) return file;
  const bitmap = await createImageBitmap(file); // applies EXIF rotation from phone photos
  const scale = Math.min(1, maxWidth / bitmap.width, maxHeight / bitmap.height);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, type, quality));
  if (!blob) return file;
  // already small and well compressed: keep the original
  if (scale === 1 && blob.size >= file.size && file.type === type) return file;
  const ext = blob.type.split('/')[1]; // Safari gives png when it can't make webp
  const name = file.name.replace(/\.[^.]+$/, '') + '.' + ext;
  return new File([blob], name, { type: blob.type });
}