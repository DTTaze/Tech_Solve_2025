import { getBuyerTransactionHistory, getAllShippingOrdersByBuyerApi } from "../../../utils/api";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/auth.context";
import { Coins } from "lucide-react";

const OrderItem = ({ transaction, onClick, onCancel }) => {
  const item = transaction.item_snapshot;

  // Map statuses to colors for UI display
  const statusStyles = {
    ready_to_pick: "bg-blue-100 text-blue-800",
    picking: "bg-blue-100 text-blue-800",
    money_collect_picking: "bg-blue-100 text-blue-800",
    picked: "bg-blue-100 text-blue-800",
    storing: "bg-blue-100 text-blue-800",
    transporting: "bg-blue-100 text-blue-800",
    sorting: "bg-blue-100 text-blue-800",
    delivering: "bg-blue-100 text-blue-800",
    delivered: "bg-purple-100 text-purple-800",
    money_collect_delivering: "bg-purple-100 text-purple-800",
    delivery_fail: "bg-red-100 text-red-800",
    waiting_to_return: "bg-yellow-100 text-yellow-800",
    return: "bg-yellow-100 text-yellow-800",
    return_transporting: "bg-yellow-100 text-yellow-800",
    return_sorting: "bg-yellow-100 text-yellow-800",
    returning: "bg-yellow-100 text-yellow-800",
    return_fail: "bg-red-100 text-red-800",
    returned: "bg-yellow-100 text-yellow-800",
    cancel: "bg-red-100 text-red-800",
    exception: "bg-red-100 text-red-800",
    lost: "bg-red-100 text-red-800",
    damage: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
  };

  return (
    <div className="rounded-lg p-4 mb-4 bg-white shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div className="text-sm font-semibold text-gray-700">
          Người bán: {item.creator?.full_name || "Không xác định"}
        </div>
        <div className="text-right mb-2">
          <span
            className={`px-2 py-1 rounded text-sm ${statusStyles[transaction.status] || "bg-gray-100 text-gray-800"}`}
          >
            {transaction.status_label.toUpperCase()}
          </span>
        </div>
      </div>
      <hr className="text-gray-300"></hr>
      <div className="flex items-center my-4">
        <img
          src={item.image_url || "/placeholder-image.jpg"}
          alt={item.name}
          className="w-16 h-16 object-cover rounded mr-4"
        />
        <div className="flex-1">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-sm text-gray-600">
            Số lượng: {transaction.quantity || 1}
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            Đơn giá: {(item.price || transaction.total_price).toLocaleString()}{" "}
            <Coins className="h-5 w-5 text-emerald-600 ml-1" />
          </p>
        </div>
      </div>
      <hr className="text-gray-300"></hr>
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          {transaction.status === "delivered" && (
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
              onClick={() => {
                /* Handle confirm receipt */
              }}
            >
              Xác nhận đã nhận
            </button>
          )}
          {transaction.status === "pending" && (
            <button
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
              onClick={() => onCancel(transaction.id)}
            >
              Hủy đơn hàng
            </button>
          )}
        </div>
        <div className="text-right">
          <p className="font-semibold flex items-center justify-end">
            Thành tiền: {transaction.total_price.toLocaleString()}{" "}
            <Coins className="h-5 w-5 text-emerald-600 ml-1" />
          </p>
        </div>
      </div>

      {(transaction.shipping_info || ["ready_to_pick", "picking", "picked", "storing", "transporting", "sorting", "delivering"].includes(transaction.status)) && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-semibold text-sm">Thông tin vận chuyển</h4>
          <p className="text-sm text-gray-600">
            Đơn vị vận chuyển: {transaction.shipping_info?.carrier || "Không xác định"}
          </p>
          <p className="text-sm text-gray-600">
            Mã vận đơn: {transaction.shipping_info?.tracking_number || "Không có"}
          </p>
          <p className="text-sm text-gray-600">
            Dự kiến giao:{" "}
            {transaction.shipping_info?.estimated_delivery
              ? new Date(transaction.shipping_info.estimated_delivery).toLocaleDateString("vi-VN")
              : "Không xác định"}
          </p>
        </div>
      )}
    </div>
  );
};

const PurchaseOrder = () => {
  const [transaction, setTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [transactionList, setTransactionList] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { auth } = useContext(AuthContext);

  const tabs = [
    { id: "all", label: "Tất cả" },
    { id: "pending", label: "Chờ xác nhận" },
    { id: "shipping", label: "Vận chuyển" },
    { id: "delivered", label: "Chờ giao hàng" },
    { id: "completed", label: "Hoàn thành" },
    { id: "cancelled", label: "Đã hủy" },
  ];

  const statusLabels = {
    pending: "Chờ xác nhận",
    ready_to_pick: "Chờ lấy hàng",
    picking: "Đang lấy hàng",
    money_collect_picking: "Đang tương tác với người gửi",
    picked: "Lấy hàng thành công",
    storing: "Nhập kho",
    transporting: "Đang trung chuyển",
    sorting: "Đang phân loại",
    delivering: "Đang giao hàng",
    delivered: "Giao hàng thành công",
    money_collect_delivering: "Đang tương tác với người nhận",
    delivery_fail: "Giao hàng không thành công",
    waiting_to_return: "Chờ xác nhận giao lại",
    return: "Chuyển hoàn",
    return_transporting: "Đang trung chuyển hàng hoàn",
    return_sorting: "Đang phân loại hàng hoàn",
    returning: "Đang hoàn hàng",
    return_fail: "Hoàn hàng không thành công",
    returned: "Hoàn hàng thành công",
    cancel: "Đơn hủy",
    exception: "Hàng ngoại lệ",
    lost: "Hàng thất lạc",
    damage: "Hàng hư hỏng",
  };

  // Map DeliveryOrder statuses to tab categories
  const statusToTab = {
    pending: "pending",
    ready_to_pick: "shipping",
    picking: "shipping",
    money_collect_picking: "shipping",
    picked: "shipping",
    storing: "shipping",
    transporting: "shipping",
    sorting: "shipping",
    delivering: "delivered",
    delivered: "completed",
    money_collect_delivering: "delivered",
    delivery_fail: "delivered",
    waiting_to_return: "delivered",
    return: "cancelled",
    return_transporting: "cancelled",
    return_sorting: "cancelled",
    returning: "cancelled",
    return_fail: "cancelled",
    returned: "cancelled",
    cancel: "cancelled",
    exception: "cancelled",
    lost: "cancelled",
    damage: "cancelled",
  };

  // Normalize data from APIs
  const normalizeTransaction = (tx, source) => {
    if (source === "transaction") {
      return {
        id: `transaction-${tx.id}`, // Prefix to avoid ID conflicts
        public_id: tx.public_id,
        status: tx.status === "accepted" ? "pending" : tx.status === "rejected" ? "cancel" : tx.status,
        status_label: statusLabels[tx.status === "accepted" ? "pending" : tx.status === "rejected" ? "cancel" : tx.status] || tx.status,
        item_snapshot: tx.item_snapshot,
        quantity: tx.quantity,
        total_price: tx.total_price,
        created_at: tx.created_at,
        shipping_info: tx.shipping_info || null,
      };
    } else {
      return {
        id: `shipping-${tx.id}`, // Prefix to avoid ID conflicts
        public_id: tx.order_code,
        status: tx.status,
        status_label: statusLabels[tx.status] || tx.status,
        item_snapshot: {
          name: "Sản phẩm không xác định",
          price: tx.total_amount,
          creator: { full_name: "Không xác định" },
          public_id: "N/A",
          description: "Không có thông tin sản phẩm",
          image_url: "/placeholder-image.jpg",
        },
        quantity: 1,
        total_price: tx.total_amount,
        created_at: tx.created_date,
        shipping_info: [
          "ready_to_pick",
          "picking",
          "money_collect_picking",
          "picked",
          "storing",
          "transporting",
          "sorting",
          "delivering",
        ].includes(tx.status)
          ? {
              carrier: "Không xác định",
              tracking_number: "N/A",
              estimated_delivery: tx.created_date,
            }
          : null,
      };
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let normalized = [];

        if (activeTab === "all") {
          // Fetch from both APIs for "all" tab
          const [transactionResponse, shippingResponse] = await Promise.all([
            getBuyerTransactionHistory(auth.user.id),
            getAllShippingOrdersByBuyerApi(auth.user.id),
          ]);

          // Normalize transaction history
          if (transactionResponse.success && Array.isArray(transactionResponse.data)) {
            normalized = [...normalized, ...transactionResponse.data.map((tx) => normalizeTransaction(tx, "transaction"))];
          }

          // Normalize shipping orders
          if (shippingResponse.success && Array.isArray(shippingResponse.data)) {
            normalized = [...normalized, ...shippingResponse.data.map((tx) => normalizeTransaction(tx, "shipping"))];
          }
        } else if (activeTab === "pending") {
          // Fetch only transaction history for "pending" tab
          const response = await getBuyerTransactionHistory(auth.user.id);
          if (response.success && Array.isArray(response.data)) {
            normalized = response.data
              .filter((tx) => tx.status === "accepted") // Only pending (accepted) transactions
              .map((tx) => normalizeTransaction(tx, "transaction"));
          }
        } else {
          // Fetch only shipping orders for other tabs
          const response = await getAllShippingOrdersByBuyerApi(auth.user.id);
          if (response.success && Array.isArray(response.data)) {
            normalized = response.data
              .filter((tx) => {
                if (activeTab === "shipping") {
                  return [
                    "ready_to_pick",
                    "picking",
                    "money_collect_picking",
                    "picked",
                    "storing",
                    "transporting",
                    "sorting",
                  ].includes(tx.status);
                } else if (activeTab === "delivered") {
                  return [
                    "delivering",
                    "money_collect_delivering",
                    "delivery_fail",
                    "waiting_to_return",
                  ].includes(tx.status);
                } else if (activeTab === "completed") {
                  return tx.status === "delivered";
                } else if (activeTab === "cancelled") {
                  return [
                    "return",
                    "return_transporting",
                    "return_sorting",
                    "returning",
                    "return_fail",
                    "returned",
                    "cancel",
                    "exception",
                    "lost",
                    "damage",
                  ].includes(tx.status);
                }
                return false;
              })
              .map((tx) => normalizeTransaction(tx, "shipping"));
          }
        }

        // Sort by created_at (newest first)
        normalized.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setTransactionList(normalized);
      } catch (error) {
        setError("Không thể tải lịch sử giao dịch. Vui lòng thử lại.");
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (auth.user?.id) {
      fetchTransactions();
    }
  }, [auth.user?.id, activeTab]);

  const handleCancelOrder = async (transactionId) => {
    try {
      // Implement API call to cancel the transaction
      // Example: await cancelTransactionApi(transactionId);
      setTransactionList((prev) =>
        prev.map((tx) =>
          tx.id === transactionId ? { ...tx, status: "cancel", status_label: statusLabels["cancel"] } : tx
        )
      );
    } catch (error) {
      setError("Không thể hủy đơn hàng. Vui lòng thử lại.");
      console.error("Lỗi khi hủy đơn hàng:", error);
    }
  };

  const filteredTransactions = transactionList
    .filter((tx) => activeTab === "all" || statusToTab[tx.status] === activeTab)
    .filter(
      (tx) =>
        tx.item_snapshot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.public_id.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const openModal = (tx) => {
    const item = tx.item_snapshot;
    setTransaction({
      "Mã giao dịch": tx.public_id,
      "Mã sản phẩm": item.public_id,
      "Nhà cung cấp sản phẩm": item.creator?.full_name || "Không xác định",
      "Tên sản phẩm": item.name,
      "Mô tả sản phẩm": item.description,
      "Giá tại thời điểm mua": (item.price || tx.total_price).toLocaleString(),
      "Số lượng": tx.quantity || 1,
      "Tổng số xu": tx.total_price.toLocaleString(),
      "Trạng thái giao dịch": tx.status_label,
      "Thời gian giao dịch":
        new Date(tx.created_at).toLocaleDateString("vi-VN") +
        " lúc " +
        new Date(tx.created_at).toLocaleTimeString("vi-VN"),
    });
    setShowModal(true);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex flex-wrap gap-2 mb-4 bg-white rounded-md">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-4 text-sm font-medium ${
              activeTab === tab.id
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-600 hover:text-blue-500"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên sản phẩm hoặc mã giao dịch..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {isLoading && <div className="text-center py-8">Đang tải...</div>}
      {error && <div className="text-red-500 text-center py-8">{error}</div>}
      {!isLoading && !error && filteredTransactions.length > 0 ? (
        <div>
          {filteredTransactions.map((tx) => (
            <OrderItem
              key={tx.id}
              transaction={tx}
              onClick={() => openModal(tx)}
              onCancel={handleCancelOrder}
            />
          ))}
        </div>
      ) : (
        !isLoading &&
        !error && (
          <div className="text-gray-500 text-center py-8">
            Chưa có giao dịch{" "}
            {activeTab !== "all"
              ? `ở trạng thái ${tabs
                  .find((t) => t.id === activeTab)
                  .label.toLowerCase()}`
              : ""}
            .
          </div>
        )
      )}

      {showModal && transaction && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4"
          role="dialog"
          aria-labelledby="modal-title"
          onKeyDown={(e) => e.key === "Escape" && setShowModal(false)}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-2 text-3xl text-gray-600 hover:text-gray-800 cursor-pointer"
              aria-label="Đóng modal"
            >
              ✖
            </button>
            <h3
              id="modal-title"
              className="text-lg font-semibold mb-4 text-center"
            >
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

export default PurchaseOrder;