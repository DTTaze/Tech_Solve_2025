import { useEffect, useState } from "react";
import { getAllTaskCompletedById, getUserApi } from "../../utils/api";

function CompletedTasksList() {
  const [user, setUser] = useState(null);
  const [userCompletedTasks, setUserCompletedTasks] = useState([]);
  const [sortKey, setSortKey] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    const fetchUserCompletedTasks = async () => {
      try {
        const responseUser = await getUserApi();
        setUser(responseUser.data);
        const responseUserCompletedTasks = await getAllTaskCompletedById(responseUser.data.id);
        console.log(responseUserCompletedTasks.data);
        setUserCompletedTasks(responseUserCompletedTasks.data.map(task => ({
          id: task.id,
          name: task.tasks.title,
          points: task.coins_per_user,
          completedAt: task.completed_at
        })));
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };

    fetchUserCompletedTasks();
  }, []);

  const requestSort = (key) => {
    const order = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortOrder(order);
  };

  const sortedTasks = [...userCompletedTasks].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  return (
    <div className="w-full p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-bold">Danh sách nhiệm vụ đã hoàn thành</h2>
      {userCompletedTasks.length > 0 ? (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                {[
                  { key: "id", label: "ID" },
                  { key: "name", label: "Tên nhiệm vụ" },
                  { key: "points", label: "Điểm" },
                  { key: "completedAt", label: "Ngày hoàn thành" },
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    className="border p-2 cursor-pointer"
                    onClick={() => requestSort(key)}
                  >
                    {label}
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
                  <td className="border p-2 text-right">{formatDate(task.completedAt)}</td>
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

export default CompletedTasksList;
