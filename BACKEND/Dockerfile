# Sử dụng image Node.js chính thức
FROM node:18

# Đặt thư mục làm việc bên trong container
WORKDIR /app

# Copy file package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt dependencies  
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Expose port 3000 (hoặc port bạn đang dùng)
EXPOSE 6060

# Chạy ứng dụng
CMD ["npx", "babel-node", "src/server.js"]