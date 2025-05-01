import { getUserTransactionHistory, getUserApi } from "../../../utils/api";
import { useEffect, useState } from "react";

const TransactionHistory = () => {
  const [transaction, setTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [transactionList, setTransactionList] = useState([]);

  useEffect(() => {
    const fetchUserTransactionHistory = async () => {
      try {
        const { data: user } = await getUserApi();
        const response = await getUserTransactionHistory(user.id);

        if (response.success && Array.isArray(response.data)) {
          setTransactionList(response.data);
        } else {
          setTransactionList([]);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };

    fetchUserTransactionHistory();
  }, []);

  const openModal = (tx) => {
    const item =
      typeof tx.item_snapshot === "string"
        ? JSON.parse(tx.item_snapshot)
        : tx.item_snapshot;
    setTransaction({
      "Mã giao dịch": tx.public_id,
      "Mã sản phẩm": item.public_id,
      "Nhà cung cấp sản phẩm": item.creator.full_name,
      "Tên sản phẩm": item.name,
      "Mô tả sản phẩm": item.description,
      "Giá tại thời điểm mua": item.price,
      "Số lượng": tx.quantity,
      "Tổng số xu": tx.total_price,
      "Trạng thái giao dịch": tx.status,
      "Thời gian giao dịch":
        new Date(tx.created_at).toLocaleDateString("vi-VN") +
        " lúc " +
        new Date(tx.created_at).toLocaleTimeString("vi-VN"),
    });
    setShowModal(true);
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white max-w-4xl mx-auto">
      <h2 className="text-lg font-semibold mb-4 text-center">
        Lịch sử giao dịch
      </h2>
      {transactionList.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Tên giao dịch</th>
              </tr>
            </thead>
            <tbody>
              {transactionList.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => openModal(tx)}
                >
                  <td className="border border-gray-300 p-2 text-blue-500 underline">
                    {tx.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-gray-500 text-center">Chưa có giao dịch.</div>
      )}

      {showModal && transaction && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-2 text-3xl text-gray-600 hover:text-gray-800 cursor-pointer"
            >
              ✖
            </button>
            <h3 className="text-lg font-semibold mb-4 text-center">
              Chi tiết giao dịch
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-sm md:text-base">
                <tbody>
                  {Object.entries(transaction).map(([key, value]) => (
                    <tr key={key}>
                      <td className="border border-gray-300 p-2 font-semibold w-1/2">
                        {key}
                      </td>
                      <td className="border border-gray-300 p-2 w-1/2">
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
