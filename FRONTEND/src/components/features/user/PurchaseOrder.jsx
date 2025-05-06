import { getUserTransactionHistory } from "../../../utils/api";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/auth.context";
import { Coins } from "lucide-react";

const OrderItem = ({ transaction, onClick }) => {
  const item = transaction.item_snapshot;

  return (
    <div className="rounded-lg p-4 mb-4 bg-white shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div className="text-sm font-semibold text-gray-700">
          Người bán: {item.creator.full_name}
        </div>
        <div className="text-right mb-2">
          <span className={`px-2 py-1 rounded text-sm ${
            transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
            transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            transaction.status === 'shipping' ? 'bg-blue-100 text-blue-800' :
            transaction.status === 'delivered' ? 'bg-purple-100 text-purple-800' :
            transaction.status === 'cancelled' ? 'bg-red-100 text-red-800' :
            transaction.status === 'returned' ? 'bg-orange-100 text-orange-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {transaction.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>
      <hr className="text-gray-300"></hr>
      <div className="flex items-center my-4">
        <img 
          src={item.image_url || '/placeholder-image.jpg'} 
          alt={item.name} 
          className="w-16 h-16 object-cover rounded mr-4"
        />
        <div className="flex-1">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-sm text-gray-600">Số lượng: {transaction.quantity}</p>
          <p className="text-sm text-gray-600 flex items-center">
            Đơn giá: {item.price.toLocaleString()} <Coins className="h-5 w-5 text-emerald-600 ml-1" />
          </p>
        </div>
      </div>
      <hr className="text-gray-300"></hr>
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          {transaction.status === 'delivered' && (
            <>
              <button 
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                onClick={() => {/* Handle confirm receipt */}}
              >
                Xác nhận đã nhận
              </button>
              <button 
                className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 text-sm"
                onClick={() => {/* Handle return/refunded request */}}
              >
                Trả hàng/Hoàn tiền
              </button>
            </>
          )}
          {transaction.status === 'pending' && (
            <button 
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
              onClick={() => {/* Handle cancel order */}}
            >
              Hủy đơn hàng
            </button>
          )}
        </div>
        <div className="text-right">
          <p className="font-semibold flex items-center justify-end">
            Thành tiền: {transaction.total_price.toLocaleString()} <Coins className="h-5 w-5 text-emerald-600 ml-1" />
          </p>
        </div>
      </div>

      {transaction.shipping_info && transaction.status === 'shipping' && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-semibold text-sm">Thông tin vận chuyển</h4>
          <p className="text-sm text-gray-600">Đơn vị vận chuyển: {transaction.shipping_info.carrier}</p>
          <p className="text-sm text-gray-600">Mã vận đơn: {transaction.shipping_info.tracking_number}</p>
          <p className="text-sm text-gray-600">Dự kiến giao: {new Date(transaction.shipping_info.estimated_delivery).toLocaleDateString('vi-VN')}</p>
        </div>
      )}
    </div>
  );
};

const PurchaseOrder = () => {
  const [transaction, setTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [transactionList, setTransactionList] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { auth } = useContext(AuthContext);

  const tabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'pending', label: 'Chờ xác nhận' },
    { id: 'shipping', label: 'Vận chuyển' },
    { id: 'delivered', label: 'Chờ giao hàng' },
    { id: 'completed', label: 'Hoàn thành' },
    { id: 'cancelled', label: 'Đã hủy' },
    { id: 'returned', label: 'Trả hàng/Hoàn tiền' },
  ];

  const statusLabels = {
    pending: 'Chờ xác nhận',
    shipping: 'Vận chuyển',
    delivered: 'Chờ giao hàng',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy',
    returned: 'Trả hàng/Hoàn tiền',
  };

  useEffect(() => {
    const fetchUserTransactionHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getUserTransactionHistory(auth.user.id);
        if (response.success && Array.isArray(response.data)) {
          setTransactionList(response.data);
        } else {
          setTransactionList([]);
        }
      } catch (error) {
        setError("Không thể tải lịch sử giao dịch. Vui lòng thử lại.");
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (auth.user?.id) {
      fetchUserTransactionHistory();
    }
  }, [auth.user?.id]);

  const filteredTransactions = transactionList
    .filter(tx => activeTab === 'all' || tx.status === activeTab)
    .filter(tx => 
      tx.item_snapshot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.public_id.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const openModal = (tx) => {
    const item = tx.item_snapshot;
    setTransaction({
      "Mã giao dịch": tx.public_id,
      "Mã sản phẩm": item.public_id,
      "Nhà cung cấp sản phẩm": item.creator.full_name,
      "Tên sản phẩm": item.name,
      "Mô tả sản phẩm": item.description,
      "Giá tại thời điểm mua": item.price.toLocaleString(),
      "Số lượng": tx.quantity,
      "Tổng số xu": tx.total_price.toLocaleString(),
      "Trạng thái giao dịch": statusLabels[tx.status] || tx.status,
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
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`px-4 py-4 text-sm font-medium ${
              activeTab === tab.id 
                ? 'border-b-2 border-blue-500 text-blue-500' 
                : 'text-gray-600 hover:text-blue-500'
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
            />
          ))}
        </div>
      ) : (
        !isLoading && !error && (
          <div className="text-gray-500 text-center py-8">
            Chưa có giao dịch {activeTab !== 'all' ? `ở trạng thái ${tabs.find(t => t.id === activeTab).label.toLowerCase()}` : ''}.
          </div>
        )
      )}

      {showModal && transaction && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4"
          role="dialog"
          aria-labelledby="modal-title"
          onKeyDown={(e) => e.key === 'Escape' && setShowModal(false)}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-2 text-3xl text-gray-600 hover:text-gray-800 cursor-pointer"
              aria-label="Đóng modal"
            >
              ✖
            </button>
            <h3 id="modal-title" className="text-lg font-semibold mb-4 text-center">
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