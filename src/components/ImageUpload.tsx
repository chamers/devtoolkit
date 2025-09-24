// 'use client';

// import { useRef, useState } from 'react';
// import {
//   upload,
//   ImageKitUploadNetworkError,
//   ImageKitInvalidRequestError,
//   ImageKitAbortError,
//   ImageKitServerError,
// } from '@imagekit/next';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Progress } from '@/components/ui/progress';
// import { Image } from '@imagekit/next';
// import { Toaster, toast } from 'sonner';

// export default function ImageUpload() {
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [progress, setProgress] = useState(0);

//   const handleUpload = async () => {
//   const fileInput = fileInputRef.current;
//   if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
//     toast.error('Please select a file first');
//     return;
//   }

//   const file = fileInput.files[0];
//   setUploading(true);
//   setProgress(0);

//   try {
//     const res = await fetch('/api/auth/imagekit');
//     const auth = await res.json();

//     const result = await upload({
//       file,
//       fileName: file.name,
//       publicKey: auth.publicKey,
//       signature: auth.signature,
//       expire: auth.expire,
//       token: auth.token,
//       useUniqueFileName: true,
//       onProgress: (evt) => {
//         setProgress((evt.loaded / evt.total) * 100);
//       },
//     });

//     setUploadedUrl(result.url ?? null);
//     toast.success('Image uploaded successfully!');
//   } catch (error) {
//     if (error instanceof ImageKitUploadNetworkError) {
//       toast.error('Network error');
//     } else if (error instanceof ImageKitInvalidRequestError) {
//       toast.error('Invalid request');
//     } else if (error instanceof ImageKitAbortError) {
//       toast.warning('Upload aborted');
//     } else if (error instanceof ImageKitServerError) {
//       toast.error('Server error');
//     } else {
//       toast.error('Unknown upload error');
//     }
//   } finally {
//     setUploading(false);
//   }
// };

//   return (
//     <div className="space-y-4 max-w-md mx-auto">
//       <Input type="file" ref={fileInputRef} />
//       <Button onClick={handleUpload} disabled={uploading}>
//         {uploading ? 'Uploading...' : 'Upload'}
//       </Button>

//       {uploading && <Progress value={progress} className="h-2" />}

//       {uploadedUrl && (
//         <div className="mt-4">
//           <p className="text-sm text-gray-500">Uploaded Image:</p>
//           <Image
//             src={uploadedUrl}
//             alt="Uploaded file"
//             width={400}
//             height={300}
//             transformation={[{ width: 400, height: 300 }]}
//             className="rounded-lg mt-2"
//           />
//         </div>
//       )}
//     </div>
//   );
// }

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
import { toast } from 'sonner';

type Props = {
  onUploaded?: (url: string | null) => void; // <-- NEW
};

export default function ImageUpload({ onUploaded }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      toast.error('Please select a file first');
      return;
    }

    const file = fileInput.files[0];
    setUploading(true);
    setProgress(0);

    try {
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

      const url = result.url ?? null;
      setUploadedUrl(url);
      onUploaded?.(url); // <-- notify parent (the form)
      toast.success('Image uploaded successfully!');
    } catch (error) {
      if (error instanceof ImageKitUploadNetworkError) {
        toast.error('Network error');
      } else if (error instanceof ImageKitInvalidRequestError) {
        toast.error('Invalid request');
      } else if (error instanceof ImageKitAbortError) {
        toast.warning('Upload aborted');
      } else if (error instanceof ImageKitServerError) {
        toast.error('Server error');
      } else {
        toast.error('Unknown upload error');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-md">
      <Input type="file" ref={fileInputRef} />
      <Button onClick={handleUpload} disabled={uploading} variant="outline">
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
