import { useState } from "react";
function ProblemStats () {
    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex flex-col xl:flex-row gap-4">
            <div className="flex-1">
                <div className="flex gap-2 h-[148px]">
                    <div className="relative flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                    {/* Simplified circular progress */}
                    <svg viewBox="0 0 100 100" className="w-40 h-40">
                        <circle cx="50" cy="50" r="42" className="stroke-green-500/20 fill-transparent" strokeWidth="3" />
                        <circle cx="50" cy="50" r="42" className="stroke-green-500 fill-transparent" strokeWidth="3" />
                    </svg>
                    <div className="absolute text-center">
                        <div className="text-3xl font-semibold">260<span className="text-sm">/3495</span></div>
                        <div className="text-sm text-green-500 flex items-center justify-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 448 512"><path d="M441 103c9.4 9.4..." /></svg>
                        Solved
                        </div>
                    </div>
                    </div>
                    <div className="flex-none w-[90px] flex flex-col gap-2">
                    {[
                        { label: 'Easy', count: '101/868', color: 'text-green-500' },
                        { label: 'Med.', count: '153/1815', color: 'text-yellow-500' },
                        { label: 'Hard', count: '6/812', color: 'text-red-500' },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-gray-50 dark:bg-gray-700 rounded-md flex-1 flex flex-col items-center justify-center">
                        <div className={`text-xs font-medium ${stat.color}`}>{stat.label}</div>
                        <div className="text-xs font-medium text-gray-800 dark:text-gray-200">{stat.count}</div>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

const Badges = () => (
  <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 w-full">
    <div className="flex items-start justify-between">
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400">Badges</div>
        <div className="text-2xl mt-1.5">2</div>
      </div>
      <svg className="w-6 h-6 text-gray-500 dark:text-gray-400 cursor-pointer" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.586 13H3a1 1 0 110-2h15.586L12 4.414A1 1 0 0113.414 3l8.293 8.293a.997.997..." />
      </svg>
    </div>
    <div className="flex justify-center gap-7 mt-4">
      <img src="https://assets.leetcode.com/static_assets/marketing/2024-50-lg.png" alt="50 Days Badge 2024" className="h-14 w-14" />
      <img src="https://assets.leetcode.com/static_assets/marketing/2024-100-lg.png" alt="100 Days Badge 2024" className="h-18 w-18" />
    </div>
    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">Most Recent Badge</div>
    <div className="text-base">100 Days Badge 2024</div>
  </div>
);

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
    <div className="flex flex-col gap-3 w-full">
      <div className="flex flex-col xl:flex-row gap-3">
        <ProblemStats />
        <Badges />
      </div>
      <CompletedTasksList />
    </div>
  );
};

export default UserDashboard;