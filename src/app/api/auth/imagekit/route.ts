// // app/api/imagekit-auth/route.ts
// // app/api/upload-auth/route.ts
// import { getUploadAuthParams } from '@imagekit/next/server';

// export async function GET() {
//   const { signature, expire, token } = getUploadAuthParams({
//     privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
//     publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
//   });

//   return Response.json({
//     signature,
//     expire,
//     token,
//     publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
//   });
// }

import { getUploadAuthParams } from '@imagekit/next/server';
import { object } from 'zod';

export async function GET() {
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
 console.log(publicKey, privateKey);
  if (!publicKey || !privateKey) {
    return new Response(
      JSON.stringify({ error: 'Missing ImageKit keys' }),
      { status: 500 }
    );
  }

  const { signature, expire, token } = getUploadAuthParams({
    publicKey,
    privateKey,
  });

  return Response.json({
    signature,
    expire,
    token,
    publicKey,
  });
}
