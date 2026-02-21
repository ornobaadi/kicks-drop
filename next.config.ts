import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Disable the built-in image optimizer to avoid server-side fetch errors
    // (e.g. ENOTFOUND for blocked/unresolvable hosts like placeimg.com).
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'i.imgur.com' },
      { protocol: 'https', hostname: '*.imgur.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'placeimg.com' },
      { protocol: 'https', hostname: 'api.lorem.space' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'fakestoreapi.com' },
      { protocol: 'https', hostname: 'cdn.pixabay.com' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: '*.cloudinary.com' },
      { protocol: 'https', hostname: 'storage.googleapis.com' },
      { protocol: 'https', hostname: 'loremflickr.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: '*.picsum.photos' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: 'pravatar.cc' },
      { protocol: 'https', hostname: '*.pravatar.cc' },
      { protocol: 'https', hostname: 'img.freepik.com' },
      { protocol: 'https', hostname: '*.freepik.com' },
      { protocol: 'https', hostname: 'api.escuelajs.co' },
      { protocol: 'https', hostname: '*.escuelajs.co' },
      { protocol: 'https', hostname: 'eduport.webestica.com' },
    ],
  },
};

export default nextConfig;
