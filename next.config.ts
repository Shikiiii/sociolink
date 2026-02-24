import type { NextConfig } from "next";
import path from "path";

const projectRoot = process.cwd();

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  outputFileTracingRoot: projectRoot,
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@swc/core*/**',
      'node_modules/@esbuild/**',
      'node_modules/webpack/**',
      'node_modules/terser/**',
    ],
  },
  webpack: (config) => {
    config.resolve.symlinks = false;
    config.resolve.modules = [
      path.resolve(projectRoot, 'node_modules'),
      'node_modules',
    ];
    config.snapshot = {
      ...config.snapshot,
      managedPaths: [path.resolve(projectRoot, 'node_modules')],
    };
    return config;
  },
};

export default nextConfig;
