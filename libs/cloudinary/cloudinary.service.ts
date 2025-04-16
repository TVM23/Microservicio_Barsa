import { Injectable } from '@nestjs/common';
import { cloudinary } from './cloudinary.config';

@Injectable()
export class CloudinaryService {
  async uploadBase64Images(base64Images: string[]): Promise<{ url: string; public_id: string }[]> {
    const imagenes: { url: string; public_id: string }[] = [];
  
    for (const base64 of base64Images) {
      try {
        const res = await cloudinary.uploader.upload(`data:image/jpeg;base64,${base64}`, {
          folder: 'materias/',
        });
  
        imagenes.push({
          url: res.secure_url,
          public_id: res.public_id,
        });
      } catch (err) {
        console.error('Error al subir imagen a Cloudinary:', err);
      }
    }
  
    return imagenes;
  }
}
