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
 * Fetch a remote image URL or process a data URI (e.g. SVG or JPG) and convert to base64 JPEG
 */
export async function urlToBase64(url: string): Promise<{ base64: string; mimeType: string }> {
  // If already a base64 JPEG/PNG, return immediately
  if (url.startsWith('data:image/jpeg') || url.startsWith('data:image/png')) {
    const mimeMatch = url.match(/^data:(image\/[a-zA-Z+]+);base64,/);
    return {
      base64: url,
      mimeType: mimeMatch ? mimeMatch[1] : 'image/jpeg',
    };
  }

  // If it's a data URI (e.g. SVG), draw to canvas to convert to a real JPEG base64 for Gemini
  if (url.startsWith('data:')) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      // Set timeout in case img never loads or errors
      const timeout = setTimeout(() => {
        // Create a blank fallback canvas
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 520;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#f1f5f9';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          resolve({ base64: canvas.toDataURL('image/jpeg', 0.85), mimeType: 'image/jpeg' });
        } else {
          resolve({ base64: url, mimeType: 'image/jpeg' });
        }
      }, 3000);

      img.onload = () => {
        clearTimeout(timeout);
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || 800;
          canvas.height = img.naturalHeight || 520;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return resolve({ base64: url, mimeType: 'image/jpeg' });
          }
          // Fill solid white background before drawing transparent SVG
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          resolve({ base64: dataUrl, mimeType: 'image/jpeg' });
        } catch (err) {
          console.warn('Canvas rasterization error:', err);
          resolve({ base64: url, mimeType: 'image/jpeg' });
        }
      };

      img.onerror = (e) => {
        clearTimeout(timeout);
        console.warn('Image load error for data URI:', e);
        // Rasterize to simple canvas fallback
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 520;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(0, 0, 800, 520);
          resolve({ base64: canvas.toDataURL('image/jpeg', 0.85), mimeType: 'image/jpeg' });
        } else {
          resolve({ base64: url, mimeType: 'image/jpeg' });
        }
      };

      img.src = url;
    });
  }

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
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        try {
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve({ base64: dataUrl, mimeType: 'image/jpeg' });
        } catch {
          // If canvas tainted, return url as-is
          resolve({ base64: url, mimeType: 'image/jpeg' });
        }
      };
      img.onerror = () => resolve({ base64: url, mimeType: 'image/jpeg' });
      img.src = url;
    });
  }
}
