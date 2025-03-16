# Sử dụng image Node.js chính thức
FROM node:18

# Cài đặt FFmpeg
RUN apt update && apt install -y ffmpeg

# Đặt thư mục làm việc bên trong container
WORKDIR /app

# Copy file package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt dependencies  
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Expose port 6060
EXPOSE 6060

# Chạy ứng dụng
CMD ["npm", "start"]
