// hooks/useGalleryUpload.js
import { useState } from 'react';
import { uploadGalleryImage, validateGalleryImage } from '@/lib/galleryUpload';
import { toast } from 'react-hot-toast';

/**
 * Custom hook for managing gallery image uploads
 * @param {string} initialImageUrl - Initial image URL if any
 * @returns {Object} - State and methods for handling image uploads
 */
export function useGalleryUpload(initialImageUrl = '') {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialImageUrl);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  /**
   * Handle image selection from file input
   * @param {Event} e - File input change event
   */
  const handleImageSelection = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate the image
    const validation = validateGalleryImage(file);
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }

    setImageFile(file);
    
    // Create a preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  /**
   * Remove the selected image
   */
  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl('');
    setImageUrl('');
  };

  /**
   * Upload the selected image to S3
   * @returns {Promise<string>} - URL of the uploaded image
   */
  const uploadImage = async () => {
    if (!imageFile) {
      return imageUrl; // Return existing URL if no new file selected
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      const toastId = toast.loading(`Uploading image... (0%)`);
      
      // Custom progress handler
      const onProgress = (percent) => {
        setUploadProgress(percent);
        toast.loading(`Uploading image... (${percent}%)`, { id: toastId });
      };
      
      // Upload image with progress tracking
      const uploadedUrl = await uploadGalleryImage(imageFile, onProgress);
      
      setImageUrl(uploadedUrl);
      toast.success('Image uploaded successfully!', { id: toastId });
      
      return uploadedUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error(`Upload failed: ${error.message}`);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    imageFile,
    previewUrl,
    imageUrl,
    uploadProgress,
    isUploading,
    handleImageSelection,
    removeImage,
    uploadImage,
  };
}

export default useGalleryUpload;