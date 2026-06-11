/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // ESLint can flag stylistic issues; we keep type-checking strict but do not
  // let lint warnings block production builds for this deliverable.
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    serverActions: {
      // Allow file uploads through server actions (MAX_UPLOAD_MB + overhead).
      bodySizeLimit: "16mb",
    },
  },
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
