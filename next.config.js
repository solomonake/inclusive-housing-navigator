/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    DATABRICKS_HOST: process.env.DATABRICKS_HOST,
    DATABRICKS_TOKEN: process.env.DATABRICKS_TOKEN,
  },
}

module.exports = nextConfig
