import CryptoJS from 'crypto-js'

// 默认的 KEY 与 iv 如果没有给
const KEY = CryptoJS.enc.Utf8.parse("90470cab9b2b45aaae0757197d9933a9"); //""中与后台一样  密码
const IV = CryptoJS.enc.Utf8.parse(); //""中与后台一样

export default {
	/**
	 * AES加密 ：字符串 key iv  返回base64
	 */
	Encrypt: function(word, keyStr, ivStr) {
		let key = KEY
		let iv = IV

		if (keyStr) {
			key = CryptoJS.enc.Utf8.parse(keyStr);
			iv = CryptoJS.enc.Utf8.parse(ivStr);
		}

		let srcs = CryptoJS.enc.Utf8.parse(word);
		var encrypted = CryptoJS.AES.encrypt(srcs, key, {
			iv: iv,
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7
		});
		// console.log("-=-=-=-", encrypted.ciphertext)
		return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
	},
	/**
	 * AES 解密 ：字符串 key iv  返回base64
	 *
	 */
	Decrypt: function(word) {
		let key = KEY;
		let base64 = CryptoJS.enc.Base64.parse(word);
		let src = CryptoJS.enc.Base64.stringify(base64);
		var decrypted = CryptoJS.AES.decrypt(src, key, {
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7
		});

		var decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
		return decryptedStr.toString();
	}

}
