console.log("\x1b[33m%s\x1b[0m", "videoController"); 
const { Video } = require("../models");

function getGoogleDriveID(url) {
    const match = url.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=))([^\/?]+)/);
    return match ? match[1] : null;
}

const addVideo = async (req, res) => {
    try {
    const { title, description, google_drive_url } = req.body;

    if (!title || !description || !google_drive_url) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const google_drive_id = getGoogleDriveID(google_drive_url);
    if (!google_drive_id) {
        return res.status(400).json({ message: "Invalid Google Drive URL" });
    }

    await Video.create({
        title,
        description,
        google_drive_url,  
        google_drive_id, 
        userId: req.session.user.id, 
    });

    res.redirect("/profile");
    } catch (err) {
    console.log("\x1b[31m%s\x1b[0m", "addVideo");     
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
    }
};

// Lấy danh sách video
const getVideos = async (req, res) => {
    
    try {
        const videos = await Video.findAll();
        res.status(200).json(videos);
    } catch (error) {
        console.log("\x1b[31m%s\x1b[0m", "getVideos"); 
        console.error(error);
        res.status(500).json({ message: "Lỗi server", error });
    }
};

export default { addVideo, getVideos };
