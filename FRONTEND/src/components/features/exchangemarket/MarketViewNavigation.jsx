import { Package, Store, Plus } from "lucide-react";

function MarketViewNavigation({ marketView, setMarketView, showCreateForm, handleAddItem }) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
      <div className="flex flex-wrap gap-2">
        <button
          className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center ${marketView === "my_items" ? "bg-emerald-600 text-white shadow-sm" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          onClick={() => setMarketView("my_items")}
        >
          <Package className="h-4 w-4 mr-1.5" />
          Sản phẩm của tôi
        </button>
        <button
          className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center ${marketView === "all_items" ? "bg-emerald-600 text-white shadow-sm" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          onClick={() => setMarketView("all_items")}
        >
          <Store className="h-4 w-4 mr-1.5" />
          Tất cả sản phẩm
        </button>
      </div>
      {marketView === "my_items" && !showCreateForm && (
        <button
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium flex items-center justify-center sm:justify-start"
          onClick={handleAddItem}
        >
          <Plus className="h-4 w-4 mr-1" />
          Thêm sản phẩm
        </button>
      )}
    </div>
  );
}

export default MarketViewNavigation;