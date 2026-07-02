const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Ensure CSS imports work for stream-chat-react on web.
config.resolver.sourceExts = [...config.resolver.sourceExts, 'css'];

module.exports = config;
