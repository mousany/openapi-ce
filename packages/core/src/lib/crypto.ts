import * as CryptoJS from 'crypto-js';

const aesChars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
/**
 * Generate a random string for AES encryption
 * @param length - Length of the string
 * @returns Random string
 */
export function randomAESString(length: number) {
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += aesChars.charAt(Math.floor(Math.random() * aesChars.length));
  }
  return result;
}

/**
 * Encode password with AES encryption
 * @param password - Password to be encoded
 * @param key - Key used to encrypt password
 * @returns Encoded password
 */
export function encodePassword(password: string, key: string): string {
  const keyWord = CryptoJS.enc.Utf8.parse(key);
  const ivWord = CryptoJS.enc.Utf8.parse(randomAESString(16));
  password = randomAESString(64) + password;
  const encrypted = CryptoJS.AES.encrypt(password, keyWord, {
    iv: ivWord,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}
