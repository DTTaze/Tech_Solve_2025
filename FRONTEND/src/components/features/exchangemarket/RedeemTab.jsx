import ItemCard from "./ItemCard";

function RedeemTab({ sortedItems, handlePurchase }) {
  return (
    <div>
      {sortedItems.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
          <img src="/placeholder.svg" alt="No items" className="w-20 h-20 mx-auto mb-4 opacity-50" />
          <p className="text-gray-500">Không tìm thấy vật phẩm phù hợp</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedItems.map((item) => (
            <ItemCard key={item.id} item={item} onPurchase={handlePurchase} />
          ))}
        </div>
      )}
    </div>
  );
}

export default RedeemTab;