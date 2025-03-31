import { getUserTransactionHistory, getUserApi } from "../../utils/api";
import { useEffect, useState } from "react";

const TransactionHistory = () => {
  const [transaction, setTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [transactionList, setTransactionList] = useState([]);

  useEffect(() => {
    const fetchUserTransactionHistory = async () => {
      try {
        const { data: user } = await getUserApi();
        const { data: transactionData } = await getUserTransactionHistory(user.id);
        
        // Nếu API trả về một giao dịch duy nhất, chuyển thành mảng để dễ xử lý
        const transactions = Array.isArray(transactionData)
          ? transactionData
          : [transactionData];

        setTransactionList(transactions);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };

    fetchUserTransactionHistory();
  }, []);

  const openModal = (tx) => {
    setTransaction({
      id: tx.id,
      name: tx.name,
      sellerId: tx.seller_id,
      buyerId: tx.buyer_id,
      itemId: tx.item_id,
      totalPrice: tx.total_price,
      quantity: tx.quantity,
      status: tx.status,
      createdAt: new Date(tx.createdAt).toLocaleDateString("vi-VN"),
    });
    setShowModal(true);
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-lg font-semibold mb-4">Lịch sử giao dịch</h2>
      {transactionList.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Tên giao dịch</th>
            </tr>
          </thead>
          <tbody>
            {transactionList.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openModal(tx)}>
                <td className="border border-gray-300 p-2 text-blue-500 underline">
                  {tx.name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-gray-500 text-center">Chưa có giao dịch.</div>
      )}

      {/* Modal hiển thị chi tiết giao dịch */}
      {showModal && transaction && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Chi tiết giao dịch</h3>
            <table className="w-full border-collapse border border-gray-300">
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">ID</td>
                  <td className="border border-gray-300 p-2">{transaction.id}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">Tên</td>
                  <td className="border border-gray-300 p-2">{transaction.name}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">Người bán</td>
                  <td className="border border-gray-300 p-2">{transaction.sellerId}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">Người mua</td>
                  <td className="border border-gray-300 p-2">{transaction.buyerId}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">ID vật phẩm</td>
                  <td className="border border-gray-300 p-2">{transaction.itemId}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">Tổng giá</td>
                  <td className="border border-gray-300 p-2">{transaction.totalPrice} coins</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">Số lượng</td>
                  <td className="border border-gray-300 p-2">{transaction.quantity}</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">Trạng thái</td>
                  <td className="border border-gray-300 p-2">
                    <span className={`px-2 py-1 rounded text-white text-sm ${transaction.status === "completed" ? "bg-green-500" : "bg-yellow-500"}`}>
                      {transaction.status === "completed" ? "Hoàn thành" : "Đang xử lý"}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-2 font-semibold">Ngày tạo</td>
                  <td className="border border-gray-300 p-2">{transaction.createdAt}</td>
                </tr>
              </tbody>
            </table>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
