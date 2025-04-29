import { useEffect, useState } from "react";
import ItemCatalog from "../components/features/exchangemarket/ItemCatalog";
import ItemCatalogSkeleton from "../components/features/exchangemarket/ItemCatalogSkeleton";
import { getUserApi } from "../utils/api";

export default function ExchangeMarket() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function initialize() {
      try {
        const userResponse = await getUserApi();
        if (!userResponse.success) {
          throw new Error("Không thể tải dữ liệu người dùng");
        }
      } catch (err) {
        setError("Lỗi khi tải dữ liệu");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    initialize();
  }, []);

  if (loading) {
    return (
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6">
        <ItemCatalogSkeleton />
      </main>
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
      <ItemCatalog />
    </main>
  );
}