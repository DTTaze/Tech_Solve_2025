export const taskColumns = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "title", headerName: "Tiêu đề", width: 230 },
  { field: "description", headerName: "Mô tả", width: 230 },
  { field: "status", headerName: "Trạng thái", width: 130 },
  { field: "coins", headerName: "Xu thưởng", width: 130 },
  { field: "difficulty", headerName: "Độ khó", width: 130 },
  { field: "total", headerName: "Tổng tiến trình", width: 130 },
  { field: "assignee", headerName: "Assignee", width: 150 },
  { field: "priority", headerName: "Priority", width: 120 },
  {
    field: "dueDate",
    headerName: "Ngày hết hạn",
    width: 200,
    valueGetter: (params) => {
      let date = new Date(params);
      let str = date.toLocaleString();
      return str;
    },
  },
  {
    field: "updated_at",
    headerName: "Ngày cập nhật",
    width: 200,
    valueGetter: (params) => {
      let date = new Date(params);
      let str = date.toLocaleString();
      return str;
    },
  },
  {
    field: "created_at",
    headerName: "Ngày khởi tạo",
    width: 200,
    valueGetter: (params) => {
      let date = new Date(params);
      let str = date.toLocaleString();
      return str;
    },
  },
];
export const itemColumns = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "name", headerName: "Name", width: 200 },
  { field: "category", headerName: "Category", width: 150 },
  { field: "price", headerName: "Price", width: 120 },
  { field: "stock", headerName: "Stock", width: 120 },
  { field: "description", headerName: "Description", width: 230 },
  { field: "status", headerName: "Status", width: 130 },
  { field: "owner_id", headerName: "Owner ID", width: 150 },
  {
    field: "updated_at",
    headerName: "Ngày cập nhật",
    width: 200,
    valueGetter: (params) => {
      let date = new Date(params);
      let str = date.toLocaleString();
      return str;
    },
  },
  {
    field: "created_at",
    headerName: "Ngày khởi tạo",
    width: 200,
    valueGetter: (params) => {
      let date = new Date(params);
      let str = date.toLocaleString();
      return str;
    },
  },
];

export const videoColumns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "title", headerName: "Title", width: 230 },
  { field: "duration", headerName: "Duration", width: 120 },
  { field: "views", headerName: "Views", width: 120 },
  { field: "url", headerName: "Url", width: 120 },
  { field: "filename", headerName: "File Name", width: 120 },
  { field: "user_id", headerName: "User ID", width: 120 },
  { field: "category", headerName: "Category", width: 150 },
  { field: "dateUploaded", headerName: "Date Uploaded", width: 150 },
  { field: "created_at", headerName: "Created At", width: 150 },
  { field: "updated_at", headerName: "Updated At", width: 150 },
];

export const avatarColumns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Name", width: 200 },
  { field: "type", headerName: "Type", width: 150 },
  { field: "usage", headerName: "Usage", width: 120 },
  { field: "dateCreated", headerName: "Date Created", width: 150 },
];
export const userColumns = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "full_name", headerName: "Full Name", width: 250 },
  { field: "username", headerName: "User Name", width: 200 },
  { field: "email", headerName: "Email", width: 250 },
  {
    field: "roles",
    headerName: "Role",
    width: 120,
    valueGetter: (params) => params?.name || "Unknown",
  },
  { field: "status", headerName: "Status", width: 120 },
  {
    field: "coins",
    headerName: "Coins",
    width: 120,
    valueGetter: (params) => params?.amount || "Unknown",
  },
  {
    field: "updated_at",
    headerName: "Ngày cập nhật",
    width: 200,
    valueGetter: (params) => {
      let date = new Date(params);
      let str = date.toLocaleString();
      return str;
    },
  },
  {
    field: "created_at",
    headerName: "Ngày khởi tạo",
    width: 200,
    valueGetter: (params) => {
      let date = new Date(params);
      let str = date.toLocaleString();
      return str;
    },
  },
];
export const roleColumns = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "name", headerName: "Tên vai trò", width: 230 },
  { field: "description", headerName: "Mô tả", width: 230 },
  {
    field: "updated_at",
    headerName: "Ngày cập nhật",
    width: 200,
    valueGetter: (params) => {
      let date = new Date(params);
      let str = date.toLocaleString();
      return str;
    },
  },
  {
    field: "created_at",
    headerName: "Ngày khởi tạo",
    width: 200,
    valueGetter: (params) => {
      let date = new Date(params);
      let str = date.toLocaleString();
      return str;
    },
  },
];

export const permissionColumns = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "action", headerName: "Hành động", width: 230 },
  { field: "subject", headerName: "Đối tượng", width: 230 },
  {
    field: "updated_at",
    headerName: "Ngày cập nhật",
    width: 200,
    valueGetter: (params) => {
      let date = new Date(params);
      let str = date.toLocaleString();
      return str;
    },
  },
  {
    field: "created_at",
    headerName: "Ngày khởi tạo",
    width: 200,
    valueGetter: (params) => {
      let date = new Date(params);
      let str = date.toLocaleString();
      return str;
    },
  },
];
export const rolesPermissionsColumns = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "action", headerName: "Action", width: 150 },
  { field: "subject", headerName: "Subject", width: 150 },
  { field: "description", headerName: "Description", width: 250 },
  {
    field: "updated_at",
    headerName: "Ngày cập nhật",
    width: 200,
    valueGetter: (params) => {
      let date = new Date(params);
      let str = date.toLocaleString();
      return str;
    },
  },
  {
    field: "created_at",
    headerName: "Ngày khởi tạo",
    width: 200,
    valueGetter: (params) => {
      let date = new Date(params);
      let str = date.toLocaleString();
      return str;
    },
  },
];
