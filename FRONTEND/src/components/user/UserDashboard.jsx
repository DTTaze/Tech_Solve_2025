import { useState } from "react";

function CompletedTasksList({ tasks = [] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "completedAt", direction: "descending" });

  const filteredTasks = tasks.filter((task) =>
    task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    return sortConfig.direction === "ascending" ? (aValue < bValue ? -1 : 1) : aValue > bValue ? -1 : 1;
  });

  const requestSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "ascending" ? "descending" : "ascending",
    });
  };

  return (
    <div className="w-full p-4 border rounded-lg shadow-md bg-white">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">Danh sách nhiệm vụ đã hoàn thành</h2>
        <input
          type="search"
          placeholder="Tìm kiếm nhiệm vụ..."
          className="border p-2 rounded-md w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {sortedTasks.length > 0 ? (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                {["ID", "Tên nhiệm vụ", "Điểm", "Ngày hoàn thành"].map((label, index) => (
                  <th
                    key={index}
                    className="border p-2 cursor-pointer"
                    onClick={() => requestSort(["id", "name", "points", "completedAt"][index])}
                  >
                    {label}
                    {sortConfig.key === ["id", "name", "points", "completedAt"][index] &&
                      (sortConfig.direction === "ascending" ? " ▲" : " ▼")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedTasks.map((task) => (
                <tr key={task.id} className="border">
                  <td className="border p-2 text-xs font-mono">{task.id}</td>
                  <td className="border p-2">{task.name}</td>
                  <td className="border p-2 font-medium text-center">+{task.points}</td>
                  <td className="border p-2 text-right">{format(task.completedAt, "dd/MM/yyyy")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center p-4 text-gray-500">Không có nhiệm vụ nào</div>
      )}
    </div>
  );
}

const UserDashboard = () => {
  return (
    <div className="">
      <CompletedTasksList />
    </div>
  );
};

export default UserDashboard;