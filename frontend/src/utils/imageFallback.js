export const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"%3E%3Crect width="600" height="400" fill="%231a1a1a"/%3E%3Ctext x="50%25" y="45%25" dominant-baseline="middle" text-anchor="middle" font-family="DM Sans, sans-serif" font-size="28" fill="%23c8f542"%3EIMAGE UNAVAILABLE%3C/text%3E%3C/svg%3E';

export const handleImageError = (e) => {
  const img = e.currentTarget;
  if (img.src !== placeholderImage) {
    img.src = placeholderImage;
    img.onerror = null;
  }
};
