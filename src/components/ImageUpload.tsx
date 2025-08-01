'use client';

import { useRef, useState } from 'react';
import {
  upload,
  ImageKitUploadNetworkError,
  ImageKitInvalidRequestError,
  ImageKitAbortError,
  ImageKitServerError,
} from '@imagekit/next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Image } from '@imagekit/next';

export default function ImageUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      alert('Please select a file first');
      return;
    }

    const file = fileInput.files[0];
    setUploading(true);
    setProgress(0);

    try {
      // Get auth params from API route
      const res = await fetch('/api/auth/imagekit');
      const auth = await res.json();

      const result = await upload({
        file,
        fileName: file.name,
        publicKey: auth.publicKey,
        signature: auth.signature,
        expire: auth.expire,
        token: auth.token,
        useUniqueFileName: true,
        onProgress: (evt) => {
          setProgress((evt.loaded / evt.total) * 100);
        },
      });

      setUploadedUrl(result.url ?? null);
    } catch (error) {
      if (error instanceof ImageKitUploadNetworkError) {
        console.error('Network error:', error.message);
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.error('Invalid request:', error.message);
      } else if (error instanceof ImageKitAbortError) {
        console.error('Upload aborted:', error.message);
      } else if (error instanceof ImageKitServerError) {
        console.error('Server error:', error.message);
      } else {
        console.error('Unknown error:', error);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <Input type="file" ref={fileInputRef} />
      <Button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </Button>

      {uploading && <Progress value={progress} className="h-2" />}

      {uploadedUrl && (
        <div className="mt-4">
          <p className="text-sm text-gray-500">Uploaded Image:</p>
          <Image
            src={uploadedUrl}
            alt="Uploaded file"
            width={400}
            height={300}
            transformation={[{ width: 400, height: 300 }]}
            className="rounded-lg mt-2"
          />
        </div>
      )}
    </div>
  );
}
