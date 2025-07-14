const pkg = require('./package.json');

module.exports = {
  expo: {
    name: 'Bluesky',
    slug: 'bluesky',
    version: pkg.version,
    platforms: ['web'],
  },
};
