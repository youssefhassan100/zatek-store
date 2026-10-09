const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: supabaseUrl
      ? [{ protocol: 'https', hostname: new URL(supabaseUrl).hostname, pathname: '/storage/v1/object/public/**' }]
      : [],
  },
};

export default nextConfig;
