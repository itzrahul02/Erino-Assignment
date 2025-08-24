import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

// Log the configuration to verify
console.log('Cloudinary Config Before Setup:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET ? '[REDACTED]' : undefined
});

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFile) => {
    try {
        if (!localFile) {
            console.log('No file path provided for upload');
            return null;
        }

        console.log('Uploading to Cloudinary:', localFile);
        const result = await cloudinary.uploader.upload(localFile, {
            resource_type: 'auto'
        });

        console.log('RESULT:', result);
        console.log('UPLOADED SUCCESSFULLY:', localFile);

        // Clean up the local file after successful upload
        if (fs.existsSync(localFile)) {
            fs.unlinkSync(localFile);
        }

        return result;
    } catch (err) {
        console.error('ERROR UPLOADING ON CLOUDINARY:', err.message);
        // Clean up the local file on error
        if (localFile && fs.existsSync(localFile)) {
            fs.unlinkSync(localFile);
        }
        return null; // Ensure a return value for the controller
    }
};



export { uploadOnCloudinary };