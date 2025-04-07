import React, { useState } from "react";
import { useS3Upload } from "next-s3-upload";
import Image from "next/image";

function UploadS3() {
  const [fileUrl, setFIleUrl] = useState<string>("");
  let { FileInput, openFileDialog, uploadToS3 } = useS3Upload();

  interface FileChangeEvent {
    file: File;
  }

  const handleFileChange = async (
    file: FileChangeEvent["file"]
  ): Promise<void> => {
    try {
      const { url }: { url: string } = await uploadToS3(file);
      setFIleUrl(url);
    } catch (error: unknown) {
      console.error("Error uploading file:", error);
    }
  };
  return (
    <div>
      <FileInput onChange={handleFileChange} />

      <button onClick={openFileDialog}>Upload file</button>

      {fileUrl && <Image src={fileUrl} alt="Uploaded file" fill />}
    </div>
  );
}

export default UploadS3;
