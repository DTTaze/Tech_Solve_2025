const { Video } = require("../models");
console.log("\x1b[33m%s\x1b[0m", "/controller/profileController");
const handleProfilePage = async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/"); // Nếu chưa đăng nhập, quay lại trang chủ
  }

  const user = req.session.user;

  try {
    // Lấy danh sách video của người dùng
    const videos = await Video.findAll({
      where: { userId: user.id },
      order: [["createdAt", "DESC"]],
    });

    // Tạo HTML hiển thị danh sách video
    let videoListHTML = videos
      .map(
        (video) => `
      <div>
        <h3>${video.title}</h3>
        <p>${video.description}</p>
        <iframe 
          src="https://drive.google.com/file/d/${video.google_drive_id}/preview" 
          width="640" 
          height="480">
        </iframe>
        <hr>
      </div>
    `
      )
      .join("");

    // Render trang HTML
    res.send(`
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>User Profile</title>
        </head>
        <body>
          <h1>Welcome, ${user.username}!</h1>
          <p>Email: ${user.email}</p>
          <h2>Post Video</h2>
          <form action="/video/add" method="POST">
            <input type="text" name="title" placeholder="Enter video title" required />
            <input type="text" name="description" placeholder="Enter video description" required />
            <input type="text" name="google_drive_url" placeholder="Enter Google Drive Video URL" required />
            <button type="submit">Post</button>
          </form>
          <br>
          <a href="/logout">Logout</a>
          <hr>
          <h2>Your Videos</h2>
          ${videoListHTML}
        </body>
      </html>
    `);
  } catch (error) {
    console.log("\x1b[31m%s\x1b[0m", "handleProfilePage");
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};

export default { handleProfilePage };
