/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // جيت هاب يحتاج معرفة اسم المستودع لجلب الملفات بشكل صحيح
  basePath: '/WZARY',
  assetPrefix: '/WZARY/',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
