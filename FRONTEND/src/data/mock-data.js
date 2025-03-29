// Users data
export const usersData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
    dateCreated: "2023-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Editor",
    status: "Active",
    dateCreated: "2023-02-20",
  },
  {
    id: 3,
    name: "Mike Brown",
    email: "mike@example.com",
    role: "User",
    status: "Inactive",
    dateCreated: "2023-03-10",
  },
  {
    id: 4,
    name: "Sarah Lee",
    email: "sarah@example.com",
    role: "User",
    status: "Active",
    dateCreated: "2023-04-05",
  },
  {
    id: 5,
    name: "Alex Chen",
    email: "alex@example.com",
    role: "Editor",
    status: "Active",
    dateCreated: "2023-05-18",
  },
];

// Roles data
export const rolesData = [
  {
    id: 1,
    name: "Admin",
    description: "Full system access",
    permissions: 15,
    dateCreated: "2023-01-01",
  },
  {
    id: 2,
    name: "Editor",
    description: "Can edit content",
    permissions: 8,
    dateCreated: "2023-01-01",
  },
  {
    id: 3,
    name: "User",
    description: "Basic access",
    permissions: 3,
    dateCreated: "2023-01-01",
  },
];

// Permissions data
export const permissionsData = [
  {
    id: 1,
    name: "Create User",
    description: "Can add new users",
    module: "Users",
    dateCreated: "2023-01-01",
  },
  {
    id: 2,
    name: "Edit User",
    description: "Can modify users",
    module: "Users",
    dateCreated: "2023-01-01",
  },
  {
    id: 3,
    name: "Delete User",
    description: "Can remove users",
    module: "Users",
    dateCreated: "2023-01-01",
  },
  {
    id: 4,
    name: "Create Content",
    description: "Can add content",
    module: "Content",
    dateCreated: "2023-01-01",
  },
  {
    id: 5,
    name: "Edit Content",
    description: "Can modify content",
    module: "Content",
    dateCreated: "2023-01-01",
  },
];

// Tasks data
export const tasksData = [
  {
    id: 1,
    title: "Implement login page",
    status: "Completed",
    assignee: "John Doe",
    priority: "High",
    dueDate: "2023-06-15",
  },
  {
    id: 2,
    title: "Design dashboard",
    status: "In Progress",
    assignee: "Jane Smith",
    priority: "Medium",
    dueDate: "2023-06-20",
  },
  {
    id: 3,
    title: "Fix payment issue",
    status: "Todo",
    assignee: "Mike Brown",
    priority: "High",
    dueDate: "2023-06-25",
  },
  {
    id: 4,
    title: "Update documentation",
    status: "In Progress",
    assignee: "Sarah Lee",
    priority: "Low",
    dueDate: "2023-06-30",
  },
];

// Items data
export const itemsData = [
  {
    id: 1,
    name: "Laptop",
    category: "Electronics",
    price: 1200,
    stock: 25,
    dateCreated: "2023-03-01",
  },
  {
    id: 2,
    name: "Smartphone",
    category: "Electronics",
    price: 800,
    stock: 50,
    dateCreated: "2023-03-05",
  },
  {
    id: 3,
    name: "Desk Chair",
    category: "Furniture",
    price: 250,
    stock: 15,
    dateCreated: "2023-03-10",
  },
  {
    id: 4,
    name: "Coffee Maker",
    category: "Appliances",
    price: 120,
    stock: 30,
    dateCreated: "2023-03-15",
  },
];

// Videos data
export const videosData = [
  {
    id: 1,
    title: "Introduction to React",
    duration: "10:30",
    views: 1250,
    category: "Education",
    dateUploaded: "2023-04-01",
  },
  {
    id: 2,
    title: "Node.js Tutorial",
    duration: "15:45",
    views: 980,
    category: "Education",
    dateUploaded: "2023-04-05",
  },
  {
    id: 3,
    title: "Product Demo",
    duration: "5:20",
    views: 450,
    category: "Marketing",
    dateUploaded: "2023-04-10",
  },
];

// Avatars data
export const avatarsData = [
  {
    id: 1,
    name: "Default Avatar",
    type: "System",
    usage: 120,
    dateCreated: "2023-01-01",
  },
  {
    id: 2,
    name: "Professional Avatar",
    type: "Premium",
    usage: 75,
    dateCreated: "2023-02-15",
  },
  {
    id: 3,
    name: "Cartoon Avatar",
    type: "Premium",
    usage: 89,
    dateCreated: "2023-03-20",
  },
];

// Table columns for each entity
export const userColumns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Name", width: 200 },
  { field: "email", headerName: "Email", width: 230 },
  { field: "role", headerName: "Role", width: 120 },
  { field: "status", headerName: "Status", width: 120 },
  { field: "dateCreated", headerName: "Date Created", width: 150 },
];

export const roleColumns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Name", width: 150 },
  { field: "description", headerName: "Description", width: 250 },
  { field: "permissions", headerName: "Permissions", width: 150 },
  { field: "dateCreated", headerName: "Date Created", width: 150 },
];

export const permissionColumns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Name", width: 200 },
  { field: "description", headerName: "Description", width: 250 },
  { field: "module", headerName: "Module", width: 150 },
  { field: "dateCreated", headerName: "Date Created", width: 150 },
];

export const taskColumns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "title", headerName: "Title", width: 230 },
  { field: "status", headerName: "Status", width: 130 },
  { field: "assignee", headerName: "Assignee", width: 150 },
  { field: "priority", headerName: "Priority", width: 120 },
  { field: "dueDate", headerName: "Due Date", width: 150 },
];

export const itemColumns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Name", width: 200 },
  { field: "category", headerName: "Category", width: 150 },
  { field: "price", headerName: "Price", width: 120 },
  { field: "stock", headerName: "Stock", width: 120 },
  { field: "dateCreated", headerName: "Date Created", width: 150 },
];

export const videoColumns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "title", headerName: "Title", width: 230 },
  { field: "duration", headerName: "Duration", width: 120 },
  { field: "views", headerName: "Views", width: 120 },
  { field: "category", headerName: "Category", width: 150 },
  { field: "dateUploaded", headerName: "Date Uploaded", width: 150 },
];

export const avatarColumns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Name", width: 200 },
  { field: "type", headerName: "Type", width: 150 },
  { field: "usage", headerName: "Usage", width: 120 },
  { field: "dateCreated", headerName: "Date Created", width: 150 },
];

