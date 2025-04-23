import { useEffect, useState } from "react";
import ItemCatalog from "../components/features/exchangemarket/ItemCatalog";
import { getAllItemsApi } from "../utils/api";
import { Loader } from "lucide-react";

export default function ExchangeMarket() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await getAllItemsApi();
        if (response.success) {
          setItems(response.data);
        } else {
          setError("Không thể tải danh sách vật phẩm");
        }
      } catch (err) {
        setError("Lỗi khi tải dữ liệu");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-10 w-10 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Lỗi đã xảy ra
          </h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
      <ItemCatalog items={items} />
    </main>
  );
}
