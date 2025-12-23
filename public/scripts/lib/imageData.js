// public/scripts/lib/imageData.js
// Cache for base64-encoded images
const imageCache = {};

/**
 * Load an image and convert it to a base64 data URI
 * @param {string} path - Path to the image relative to public/
 * @returns {Promise<string>} Base64 data URI
 */
export async function getImageDataURI(path) {
  if (imageCache[path]) {
    return imageCache[path];
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    
    // Resolve path against current origin so it works in both app and print views
    let src = path;
    try {
      if (typeof window !== 'undefined' && window.location) {
        // If already absolute (http, https, data), keep as-is
        if (/^data:/.test(path) || /^https?:\/\//.test(path)) {
          src = path;
        } else {
          src = new URL(path, window.location.origin || window.location.href).href;
        }
      }
    } catch (_) {
      src = path;
    }

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataURI = canvas.toDataURL('image/png');
        imageCache[path] = dataURI;
        resolve(dataURI);
      } catch (err) {
        reject(err);
      }
    };
    
    img.onerror = () => {
      reject(new Error(`Failed to load image: ${path}`));
    };
    
    img.src = src;
  });
}

/**
 * Preload all techybara images
 * @returns {Promise<Object>} Object with image paths as keys and data URIs as values
 */
export async function preloadTechybaraImages() {
  const images = {
    teacher: './techybara/teacher.png',
    peekOut: './techybara/peek out.png',
    peekOutFront: './techybara/peek out front.png'
  };
  
  const results = {};
  
  for (const [key, path] of Object.entries(images)) {
    try {
      results[key] = await getImageDataURI(path);
    } catch (err) {
      console.warn(`Failed to load ${key}:`, err);
      results[key] = ''; // Fallback to empty string
    }
  }
  
  return results;
}
