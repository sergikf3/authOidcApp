const copyConfig = require('../node_modules/@ionic/app-scripts/config/copy.config');
copyConfig.copyAssets = {
    src: ['{{SRC}}/assets/**/*', '{{ROOT}}/node_modules/oidc-client/dist/oidc-client.js'],
    dest: '{{WWW}}/assets'
  }
