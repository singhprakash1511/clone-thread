const cloudinary = require("cloudinary").v2;
const fs = require('fs');

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;

        //upload file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        //file has been uploaded successfully
        fs.unlinkSync(localFilePath)

        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed

        return null;
    }
}

const postUploadOnCloudinary = async (localFilePath,folder) => {
    try {
         const options = {folder}
         options.resource_type = "auto"
 
         //upload file on cloudinary and return the response
         const response= await cloudinary.uploader.upload(localFilePath, options)

        // file has been uploaded successfully
         fs.unlinkSync(localFilePath)
         return response;

    } catch (error) {
         fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
 
         return null;
    }
 }

module.exports = {uploadOnCloudinary, postUploadOnCloudinary}