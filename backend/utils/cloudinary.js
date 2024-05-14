const cloudinary = require("cloudinary").v2;
const fs = require('fs');

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
});

const uploadOnCloudinary = async (file) => {
    try {
        if(!file) return null;

        //upload file on cloudinary
        const response = await cloudinary.uploader.upload(file, {
            resource_type: "auto"
        })

        return response;
    } catch (error) {
        fs.unlinkSync(file) // remove the locally saved temporary file as the upload operation got failed

        return null;
    }
}

const postUploadOnCloudinary = async (file,folder) => {
    try {
         const options = {folder}
         options.resource_type = "auto"
         console.log(file,"cloudinary")
 
         //upload file on cloudinary and return the response
         const response= await cloudinary.uploader.upload(file, options)

        // file has been uploaded successfully
         return response;

    } catch (error) {
         fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
 
         return null;
    }
 }

module.exports = {uploadOnCloudinary, postUploadOnCloudinary}