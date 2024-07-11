const withTM = require('next-transpile-modules')(['@nextui-org/react']);
const withImages = require('next-images');

module.exports = withTM(withImages({
  
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000', // Asegúrate de usar el puerto correcto si es diferente
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8080', // Asegúrate de usar el puerto correcto si es diferente
      }
    ],
  },
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }

    return config;
  },
}));
