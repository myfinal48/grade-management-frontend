import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration Turbopack (maintenant stable)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  // Désactive les warnings de développement non critiques
  onDemandEntries: {
    // période en ms où la page est gardée en mémoire
    maxInactiveAge: 25 * 1000,
    // nombre de pages qui doivent être gardées simultanément
    pagesBufferLength: 2,
  },
  // Configuration pour éviter les erreurs de runtime
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Améliore la gestion des erreurs en développement
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      };
    }
    return config;
  },
};

export default nextConfig;
