/**
 * Convert a File object to a base64 string, resizing if larger than max dimension to optimize upload speed
 */
export async function fileToBase64(file: File, maxDimension = 1600): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve({
            base64: (e.target?.result as string) || '',
            mimeType: file.type || 'image/jpeg',
          });
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve({
          base64: dataUrl,
          mimeType: 'image/jpeg',
        });
      };
      img.onerror = () => {
        resolve({
          base64: (e.target?.result as string) || '',
          mimeType: file.type || 'image/jpeg',
        });
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Fetch a remote image URL (e.g. from sample rooms) and convert to base64
 */
export async function urlToBase64(url: string): Promise<{ base64: string; mimeType: string }> {
  try {
    const response = await fetch(url, { mode: 'cors' });
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          base64: reader.result as string,
          mimeType: blob.type || 'image/jpeg',
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    // If CORS prevents direct fetch of remote image, draw via image tag with crossOrigin
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 800;
        canvas.height = img.naturalHeight || 600;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Canvas context unavailable'));
        }
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve({ base64: dataUrl, mimeType: 'image/jpeg' });
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = url;
    });
  }
}
