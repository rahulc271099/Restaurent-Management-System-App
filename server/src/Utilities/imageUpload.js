const cloudinary = require('../config/cloudinaryConfig')


const uploadToCloudinary = (filePath) =>{
    return new Promise((resolve,reject) =>{
        cloudinary.uploader.upload(
            filePath,
            {folder:'RestaurentImages'},
            ((error,result) =>{
                if(error) return reject
                resolve(result.secure_url)
            })
        )
    })
}

module.exports = uploadToCloudinary