# Sử dụng image Node.js phiên bản 18 (có thể thay đổi nếu cần)
FROM node:18

# Đặt thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json trước để cache layer khi build
COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm install
# Copy toàn bộ source code vào container
COPY . .

# Expose cổng của Vite (mặc định là 5173)
EXPOSE 5173

# Dùng lệnh này để phát triển với hot reload
CMD ["npm", "run", "dev", "--", "--host"]
