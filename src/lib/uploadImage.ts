import axios from 'axios';

/**
 * Uploads an image to S3 via presigned URL and returns the public URL
 * @param file - The file to upload
 * @returns The URL of the uploaded image
 */
export async function uploadImageToCloud(file: File): Promise<string> {
  try {
    console.log('Starting upload process...');
    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // Step 1: Get the presigned URL from the backend
    const { data: presignedPostData } = await axios.post('/api/get-upload-url', {
      fileName: `profile-images/${Date.now()}-${file.name}`,
      fileType: file.type,
    });
    console.log('Presigned post data received:', presignedPostData);

    // Step 2: Prepare the form data for the upload
    const formData = new FormData();
    Object.entries(presignedPostData.fields).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    formData.append('file', file);
    console.log('Form data prepared for upload:', formData);

    // Step 3: Upload the file to S3
    const uploadResponse = await axios.post(presignedPostData.url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('File uploaded successfully:', uploadResponse.status, uploadResponse.statusText);

    // Step 4: Return the public URL of the uploaded file
    const uploadedUrl = `${process.env.NEXT_PUBLIC_S3_URL_PREFIX}/${presignedPostData.fields.key}`;
    console.log('Uploaded file URL:', uploadedUrl);

    return uploadedUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}