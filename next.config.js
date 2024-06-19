const withTM = require('next-transpile-modules')(['@nextui-org/react']);
const withImages = require('next-images');

module.exports = withTM(withImages({
  fileExtensions: ["jpg", "jpeg", "png", "gif", "svg"],
  images: {
    domains: ['localhost'],
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
