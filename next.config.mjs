import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  turbopack: {
    // Force project root to this folder to avoid mis-detected parent lockfile
    root: __dirname,
  },
}

export default nextConfig
