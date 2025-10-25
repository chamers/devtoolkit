import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // existing
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "m.media-amazon.com" },
      { protocol: "https", hostname: "ik.imagekit.io" },
      { protocol: "https", hostname: "randomuser.me" },
      { protocol: "https", hostname: "cdn.dribbble.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },

      // seed/demo hosts (add both bare + www when applicable)
      { protocol: "https", hostname: "nslookup.io" },
      { protocol: "https", hostname: "www.nslookup.io" },

      { protocol: "https", hostname: "static.figma.com" },

      { protocol: "https", hostname: "app.sketchup.com" },

      { protocol: "https", hostname: "static.grammarly.com" },

      { protocol: "https", hostname: "buffer.com" },
      { protocol: "https", hostname: "www.buffer.com" }, // sometimes redirects

      { protocol: "https", hostname: "www.blackmagicdesign.com" },

      { protocol: "https", hostname: "www.notion.so" },

      { protocol: "https", hostname: "www.coursera.org" }, // <-- this fixes your error
      { protocol: "https", hostname: "coursera.org" },
      { protocol: "https", hostname: "randomuser.me" },
    ],
    // If you’re displaying lots of favicons/thumbnails from many domains,
    // consider enabling this to bypass optimization (optional):
    // unoptimized: true,
  },
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
