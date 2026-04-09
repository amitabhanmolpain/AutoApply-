/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn-icons-png.flaticon.com' },
      { protocol: 'https', hostname: 'assets.intershala.com' },
      { protocol: 'https', hostname: 'cdn.wellfound.com' },
      { protocol: 'https', hostname: '*.wikimedia.org' },
      { protocol: 'https', hostname: '*.intershala.com' },
      { protocol: 'https', hostname: '*.naukri.com' },
      { protocol: 'https', hostname: 'e7.pngegg.com' },
      { protocol: 'https', hostname: 'cdn.imgbin.com' },
      { protocol: 'https', hostname: 'encrypted-tbn0.gstatic.com' },
      { protocol: 'https', hostname: 'cdn.aptoide.com' },
      { protocol: 'https', hostname: 'static.naukimg.com' },
    ],
  },
}

export default nextConfig
