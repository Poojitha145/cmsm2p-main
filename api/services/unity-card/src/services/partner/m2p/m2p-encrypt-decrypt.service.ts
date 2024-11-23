import { BindingScope, inject, injectable } from '@loopback/core';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

import randomatic from 'randomatic';
import { M2PCardApiConfig } from './card/m2p-card-api.config';
import { Bindings } from '../../../models/bindings';
import { AppConfig } from '../../../models/config.model';

@injectable({ scope: BindingScope.SINGLETON, tags: Bindings.Service.M2P_ENCRYPT_DECRYPT_SERVICE })
export class M2PEncryptDecryptService {

  private symmetricKeyAlgorithm: string = 'aes-256-gcm';
  // private asymmetricKeyAlgorithm: string = 'RSA-OAEP';
  // private digitalSignatureAlgorithm: string = 'SHA256';

  private readonly privateKey: string;
  private readonly publicKey: string;

  constructor(@inject(Bindings.Config.APP_CONFIG)
  private appConfig: AppConfig) {

    this.privateKey = fs.readFileSync(path.resolve(appConfig.PARTNER_M2P_PRIVATE_KEY_PATH), 'utf8');
    this.publicKey = fs.readFileSync(path.resolve(appConfig.PARTNER_M2P_PUBLIC_KEY_PATH), 'utf8');
  }

  private generateDigitalSignedToken(data: string): string {
    const sign: crypto.Sign = crypto.createSign('sha256');
    sign.update(data);
    return sign.sign(this.privateKey, 'base64');
  }

  private encryptData(data: string, sessionKey: Buffer, messageRefNo: string): string {
    let cipher: any = crypto.createCipheriv('aes-256-gcm', sessionKey,
      Buffer.from(messageRefNo), { authTagLength: 16 });
    cipher.setAutoPadding(false);
    const encrypted = Buffer.concat([cipher.update(data, 'utf8'),
    cipher.final(), cipher.getAuthTag()]);
    return encrypted.toString('base64');
  }

  private encryptKey(key: any): string {
    const encrypted = crypto.publicEncrypt({
      key: this.publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256'
    }, Buffer.from(key));
    return encrypted.toString('base64');
  }


  private decryptKey(key: any): Buffer {
    let decryptedKey: Buffer = crypto.privateDecrypt({
      key: this.privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    }, key);
    return decryptedKey
  };

  private decryptData(data: any, key: string, refNo: string): string {
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(refNo), {
      authTagLength: 16
    });
    decipher.setAutoPadding(false);
    const authTag = data.slice(-16); // Extract the authentication tag
    const dataWithoutAuthTag = data.slice(0, -16); // Extract the encrypted data
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([decipher.update(dataWithoutAuthTag), decipher.final()]);
    return decrypted.toString('utf-8');
  }

  encryptRequestPayload(data: string, entityId: string): any {
    const referenceNo = randomatic('0', 16)
    const sessionKey: Buffer = crypto.randomBytes(32);
    const token = this.generateDigitalSignedToken(data);
    const encryptedData = this.encryptData(data, sessionKey, referenceNo);
    const encryptedKey = this.encryptKey(sessionKey);
    const encryptedEntity = this.encryptKey(Buffer.from(entityId));
    const encryptedRequest = {
      entity: encryptedEntity,
      key: encryptedKey,
      refNo: referenceNo,
      body: encryptedData,
      token,
    };
    return encryptedRequest;
  }

  decryptResponseData(key: string, entity: string, body: string, hash: string, refNo: string): any {
    const encryptedKey = Buffer.from(key, 'base64');
    const data = Buffer.from(body, 'base64');
    const sessionKey: any = this.decryptKey(encryptedKey);
    let decryptedData = this.decryptData(data, sessionKey, refNo);
    return JSON.parse(decryptedData)
  }

  generateKey(): Buffer {
    return crypto.randomBytes(32);
  }

  async encryptData1(requestData: string, sessionKey: any, messageRefNo: string): Promise<string> {
    const cipher = crypto.createCipheriv('aes-256-gcm', sessionKey,
      Buffer.from(messageRefNo), { authTagLength: 16 } as crypto.CipherCCMOptions);
    cipher.setAutoPadding(false);

    const encrypted: Buffer = Buffer.concat([
      cipher.update(requestData, 'utf8'),
      cipher.final(), (cipher as any).getAuthTag()
    ]);
    return encrypted.toString('base64');
  }

  async decryptBody(body: Buffer, decryptedKey: Buffer, refNo: string): Promise<string> {
    const decipher = crypto.createDecipheriv(this.symmetricKeyAlgorithm, decryptedKey,
      Buffer.from(refNo), { authTagLength: 16 } as crypto.CipherCCMOptions);
    decipher.setAutoPadding(false);

    const authTag = body.slice(-16); // Extract the authentication tag
    const dataWithoutAuthTag = body.slice(0, -16); // Extract the encrypted data
    (decipher as any).setAuthTag(authTag);
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(dataWithoutAuthTag)),
      decipher.final()
    ]);
    return decrypted.toString('utf-8');
  }
}