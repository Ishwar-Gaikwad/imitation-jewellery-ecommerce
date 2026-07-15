import { resolve } from 'node:dns';
import cloudinary from '../config/cloudinary.js';
import { rejects } from 'node:assert';

export const uploadImages = async (req,  res, next) => {
    try {
        if(!req.files || req.files.length === 0) {
            res.status(400);
            throw new Error('No files uploaded');
        }

        const uploadPromises = req.files.map((file) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'jwellery-store/products' },
                    (error, result) => {
                        if(error) reject(error);
                        else resolve(result.secure_url);
                    }
                );
                stream.end(file.buffer);
            });
        });

        const imageUrls = await Promise.all(uploadPromises);

        res.status(200).json({ success: true, images: imageUrls });
    } catch (error) {
        next(error);
    }
};