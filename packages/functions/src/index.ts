import { FunctionParser } from 'firebase-backend';

exports = new FunctionParser({ rootPath: __dirname, exports, verbose: true })
  .exports;

// const backendVersion = "v1";
// const seperator = "_";

// for (const key in exports) {
//   if (Object.prototype.hasOwnProperty.call(exports, key)) {
//     exports[`${backendVersion}${seperator}${key}`] = exports[key];
//     delete exports[key];
//   }
// }
