// src/services/S3Service.js
// Servicio para subir imágenes y resultados a S3 compatible (AWS o Cloud Storage)
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.S3_REGION
});

const BUCKET = process.env.S3_BUCKET;

class S3Service {
  /**
   * Sube una imagen base64 a S3
   * @param {string} key - Nombre del archivo (ej: 'tasks/123/image.png')
   * @param {string} imageBase64 - Imagen en base64
   * @returns {Promise<string>} - URL pública de la imagen
   */
  static async uploadImage(key, imageBase64) {
    const buffer = Buffer.from(imageBase64, 'base64');
    await s3.putObject({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentEncoding: 'base64',
      ContentType: 'image/png',
      ACL: 'public-read'
    }).promise();
    return `https://${BUCKET}.s3.amazonaws.com/${key}`;
  }

  /**
   * Sube un resultado JSON a S3
   * @param {string} key - Nombre del archivo (ej: 'tasks/123/result.json')
   * @param {object} result - Objeto resultado
   * @returns {Promise<string>} - URL pública del JSON
   */
  static async uploadResult(key, result) {
    await s3.putObject({
      Bucket: BUCKET,
      Key: key,
      Body: JSON.stringify(result),
      ContentType: 'application/json',
      ACL: 'public-read'
    }).promise();
    return `https://${BUCKET}.s3.amazonaws.com/${key}`;
  }
}

module.exports = S3Service;
