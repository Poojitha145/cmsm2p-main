import { BinaryLike, Cipher, CipherKey, Decipher, createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';

export namespace Crypto {

    export function encrypt(text: string, secretKey: any): string {
        const iv: any = randomBytes(16);
        const cipher: Cipher = createCipheriv('aes256', secretKey, iv);
        return [
            cipher.update(text, 'utf8', 'hex') + cipher.final('hex'),
            Buffer.from(iv).toString("hex")
        ].join("|");
    }

    export function decrypt(encryptedText: string, secretKey: any): string {
        const [encrypted, iv] = encryptedText.split("|");
        const decipher: Decipher = createDecipheriv('aes256', secretKey, Buffer.from(iv, 'hex'));
        return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
    }
}