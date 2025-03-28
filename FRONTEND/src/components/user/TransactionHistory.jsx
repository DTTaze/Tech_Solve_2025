const transactions = [
  { date: "2025-03-20", description: "Chậu hoa", status: "Completed" },
  { date: "2025-03-21", description: "Áo thun", status: "Pending" },
  { date: "2025-03-22", description: "Giày", status: "Completed" }
];

const TransactionHistory = () => {
  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-lg font-semibold mb-4">Lịch sử giao dịch</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Ngày</th>
            <th className="border border-gray-300 p-2">Mô tả</th>
            <th className="border border-gray-300 p-2">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border border-gray-300 p-2">{tx.date}</td>
              <td className="border border-gray-300 p-2">{tx.description}</td>
              <td className="border border-gray-300 p-2">
                <span className={`px-2 py-1 rounded text-white text-sm ${tx.status === "Completed" ? "bg-green-500" : "bg-yellow-500"}`}>
                  {tx.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;