const imageService = require("../services/imageService.js");

const handleUploadImage = async (req, res) => {
  try {
    const files = req.files; 

    const { reference_id, reference_type } = req.body;

    if (!files || files.length === 0) {
      return res.error(400, "No files uploaded");
    }

    if (!reference_id || !reference_type) {
      return res.status(400).json({ message: "Missing reference_id or reference_type" });
    }

    const validTypes = ["avatar", "taskSubmit"];
    if (!validTypes.includes(reference_type)) {
      return res.status(400).json({ message: "Invalid reference_type" });
    }

    const images = await imageService.uploadImages(files, reference_id, reference_type);


    return res.success("Images uploaded successfully", images);
  } catch (error) {
    console.error("Error uploading images:", error);
    return res.status(500).json({ message: "Error uploading images", error });
  }
};


const handleGetImageById = async (req, res) => {
  try {
    const id  = req.params.id;
    const image = await imageService.getImageById(id);

    if (!image) {
      return res.notFound("Image not found");
    }

    return res.success("Image found", image);
  } catch (error) {
    return res.error(500, "Error getting image", error);
  }
}

const handleGetAllImages = async (req, res) => {
  try {
    const images = await imageService.getAllImages();
    return res.success("Images found", images);
  } catch (error) {
    return res.error(500, "Error getting images", error);
  }
}

const handleUpdateImage = async (req, res) => {
  try {
    const id  = req.params.id;
    const { file } = req;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const image = await imageService.updateImage(id, file);

    return res.status(200).json(image);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
const handleDeleteImage = async (req, res) => {
  try {
    const id  = req.params.id;
    const result = await imageService.deleteImage(id);

    if (result.error) {
      return res.status(404).json({ message: result.error });
    }

    return res.status(200).json({ message: result.message });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
module.exports = { 
  handleUploadImage,
  handleGetImageById,
  handleGetAllImages,
  handleUpdateImage,
  handleDeleteImage
};

