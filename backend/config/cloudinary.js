import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

cloudinary.config({ 
    cloud_name: "djoih9y1m", 
    api_key: "168772683915165",
    api_secret: "Gl3TM4OOkckIX_CxsSBKUt4DD3Q"
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        const uploadResult = await cloudinary.uploader.upload(localFilePath);
        fs.unlinkSync(localFilePath)
        console.log(uploadResult);
        return uploadResult
    } catch (error) {
        console.error(error);
        fs.unlinkSync(localFilePath);
    }
}
export { uploadOnCloudinary }