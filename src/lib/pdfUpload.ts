// lib/galleryUpload.js
import axios from 'axios';

/**
 * Uploads a gallery image to S3 via presigned URL and returns the public URL
 * @param file - The image file to upload
 * @returns The URL of the uploaded gallery image
 */
export async function uploadPDF(file: File, onProgress?: (progress: number) => void): Promise<string> {
  try {
    console.log('Starting PDF image upload...');
    
    // Generate a unique folder path for gallery images
    const pdfFolderPath = `pdf-files/${new Date().getFullYear()}/${new Date().getMonth() + 1}`;
    
    // Create a unique filename with timestamp and original name
    const uniqueFileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const fullPath = `${pdfFolderPath}/${uniqueFileName}`;
    
    console.log('PDF image upload details:', {
      fileName: fullPath,
      fileType: file.type,
      fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
    });

    // Step 1: Get the presigned URL from the backend
    const { data: presignedPostData } = await axios.post('/api/get-upload-url', {
      fileName: fullPath,
      fileType: file.type,
    });
    console.log('Presigned post data received for PDF upload');

    // Step 2: Prepare the form data for the upload
    const formData = new FormData();
    Object.entries(presignedPostData.fields).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    formData.append('file', file);

    // Step 3: Upload the file to S3
    const uploadResponse = await axios.post(presignedPostData.url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          progressEvent.total ? (progressEvent.loaded * 100) / progressEvent.total : 0
        );
        console.log(`Upload progress: ${percentCompleted}%`);
        
        // Call the onProgress callback if provided
        if (onProgress && typeof onProgress === 'function') {
          onProgress(percentCompleted);
        }
      },
    });
    
    console.log('PDF image uploaded successfully:', uploadResponse.status);

    // Step 4: Return the public URL of the uploaded file
    const uploadedUrl = `${process.env.NEXT_PUBLIC_S3_URL_PREFIX}/${presignedPostData.fields.key}`;
    console.log('PDF image URL:', uploadedUrl);

    return uploadedUrl;
  } catch (error) {
    console.error('Error uploading PDF:', error);
    
    // Enhanced error reporting
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error('Error response from server:', error.response.data);
        console.error('Status code:', error.response.status);
      } else if (error.request) {
        console.error('No response received from server');
      }
    }
    
    throw new Error('Failed to upload PDF image');
  }
}

/**
 * Validate PDF before upload
 * @param file - The file to validate
 * @returns An object with validation status and error message if any
 */
export function validatePDF(file: File): { valid: boolean; message?: string } {
  // Check if file is an image
  // Check if the file's MIME type indicates it's a PDF document
  // The MIME type for PDF files is "application/pdf"
  if (!file.type.startsWith("application/pdf")) {
    return { valid: false, message: "Please select a PDF file" };
    }
  
  // Check file size (15MB limit)
  const MAX_SIZE = 15 * 1024 * 1024; // 15MB in bytes
  if (file.size > MAX_SIZE) {
    return { 
      valid: false, 
        message: `File is too large. Maximum size is 10MB, your file is ${(file.size / 1024 / 1024).toFixed(2)}MB` 
    };
  }
  
  // Additional validations can be added here
  
  return { valid: true };
}