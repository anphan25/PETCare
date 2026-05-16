// Polyfill TextEncoder / TextDecoder for jsdom (react-router-dom needs them)
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
