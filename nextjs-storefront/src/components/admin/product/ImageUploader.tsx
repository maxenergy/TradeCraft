'use client';

import React, { useState } from 'react';
import axios from 'axios';

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      // Step 1: Request a presigned URL from our backend
      const { data } = await axios.get(`/api/v1/admin/files/presigned-url?filename=${file.name}`);
      const { presignedUrl, finalUrl } = data;

      console.log('Received presigned URL:', presignedUrl);
      console.log('Final URL will be:', finalUrl);

      // Step 2: Upload the file directly to the presigned URL (mocked)
      // In a real app, this would be an actual PUT request to a cloud storage URL.
      // await axios.put(presignedUrl, file, {
      //   headers: { 'Content-Type': file.type },
      // });
      console.log(`(Mock) Uploading ${file.name} to the presigned URL...`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload time

      // Step 3: On success, update the state and call the callback
      setPreview(URL.createObjectURL(file)); // Show a local preview
      onUploadSuccess(finalUrl); // Pass the final URL to the parent form

    } catch (err) {
      console.error("Upload failed:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
        Product Image
      </label>
      <div className="mt-1 flex items-center">
        <span className="inline-block h-24 w-24 overflow-hidden rounded-md bg-gray-100">
          {preview ? (
            <img src={preview} alt="Image preview" className="h-full w-full object-cover" />
          ) : (
            <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 20.993V24H0v-2.993A2 2 0 002 18h20a2 2 0 002 2.993zM8 11a4 4 0 110-8 4 4 0 010 8zm8 0a4 4 0 110-8 4 4 0 010 8z" />
            </svg>
          )}
        </span>
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          className="ml-5"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </div>
      {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
