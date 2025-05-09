import { useMemo, useContext } from "react";
import MarketViewNavigation from "./MarketViewNavigation";
import CreateItemModal from "./CreateItemModal";
import MarketSearchBar from "./MarketSearchBar";
import MarketFilterButtons from "./MarketFilterButtons";
import MarketItemList from "./MarketItemList";
import MarketEmptyState from "./MarketEmptyState";
import {
  MarketplaceContext,
  marketplaceCategories,
  statusColors,
  statusConfig,
  getCategoryDisplayName,
  userItemStatuses, // Thêm import này
} from "./ItemCatalog";

function UserItemsTab() {
  const {
    myItems,
    marketSearchText,
    setMarketSearchText,
    marketListView,
    setMarketListView,
    marketStatusFilter,
    setMarketStatusFilter,
    showCreateModal,
    setShowCreateModal,
    itemToEdit,
    setItemToEdit,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    handlePurchase,
    handleSubmitItem,
    handleCancelForm,
  } = useContext(MarketplaceContext);

  const filteredMarketItems = useMemo(() => {
    if (!myItems?.length) return [];
    let filtered = [...myItems];
    if (marketStatusFilter !== "all") {
      filtered = filtered.filter((item) => item.postStatus === marketStatusFilter);
    }
    if (marketSearchText) {
      const searchLower = marketSearchText.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower)
      );
    }
    return filtered;
  }, [myItems, marketStatusFilter, marketSearchText]);

  return (
    <div className="space-y-6">
      <CreateItemModal
        isOpen={showCreateModal}
        item={itemToEdit}
        onSubmit={handleSubmitItem}
        onCancel={handleCancelForm}
      />
      <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col gap-4">
        <MarketSearchBar
          marketSearchText={marketSearchText}
          setMarketSearchText={setMarketSearchText}
          marketListView={marketListView}
          setMarketListView={setMarketListView}
        />
        <MarketFilterButtons
          marketView="my_items"
          marketStatusFilter={marketStatusFilter}
          setMarketStatusFilter={setMarketStatusFilter}
          filteredMarketItems={filteredMarketItems}
          marketplaceCategories={marketplaceCategories}
          userItemStatuses={userItemStatuses}
          statusColors={statusColors}
        />
      </div>
      {filteredMarketItems.length === 0 ? (
        <MarketEmptyState
          marketView="my_items"
          marketStatusFilter={marketStatusFilter}
          handleAddItem={handleAddItem}
        />
      ) : (
        <MarketItemList
          marketListView={marketListView}
          marketView="my_items"
          filteredMarketItems={filteredMarketItems}
          handleEditItem={handleEditItem}
          handleDeleteItem={handleDeleteItem}
          handlePurchase={handlePurchase}
          getCategoryDisplayName={getCategoryDisplayName}
          statusColors={statusColors}
          statusConfig={statusConfig}
        />
      )}
    </div>
  );
}

export default UserItemsTab;