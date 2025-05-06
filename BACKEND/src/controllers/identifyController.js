const identifyService = require("../services/identifyService");


const handleIdentifyImage = async (req,res) => {
    try {
        const result = await identifyService.identifyImage(req.file.buffer, req.file.originalname);
        res.success("Successful identify image", result)
    }catch (error){
        console.log("error identify image :" ,error);
        res.error(400,"error identify image", error);
    }
}

module.exports = {
    handleIdentifyImage
}