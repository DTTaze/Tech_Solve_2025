function ItemActions({ marketView, item, handleEditItem, handleDeleteItem, handlePurchase }) {
    return (
      <div className="flex justify-end gap-2">
        {marketView === "my_items" ? (
          <>
            <button
              onClick={() => handleEditItem(item)}
              className="text-indigo-600 hover:text-indigo-900"
            >
              Sửa
            </button>
            <button
              onClick={() => handleDeleteItem(item.id)}
              className="text-red-600 hover:text-red-900"
            >
              Xóa
            </button>
          </>
        ) : (
          <button
            onClick={() => handlePurchase(item)}
            className="text-indigo-600 hover:text-indigo-900"
            disabled={!item.canPurchase}
          >
            Mua
          </button>
        )}
      </div>
    );
  }
  
  export default ItemActions;