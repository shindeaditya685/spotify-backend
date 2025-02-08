import cloudinary from "./cloudinary.js";

const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.log("Error in uploadCloudinary: ", error);
    throw new Error("Error while uploading to cloudinary: ", error);
  }
};

export default uploadToCloudinary;
