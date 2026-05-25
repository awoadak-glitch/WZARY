/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/WZARY', // أضفنا اسم مستودعك هنا ليصبح الرابط متوافقاً
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
