import { useMemo, useContext } from "react";
import MarketSearchBar from "./MarketSearchBar";
import MarketFilterButtons from "./MarketFilterButtons";
import MarketItemList from "./MarketItemList";
import MarketEmptyState from "./MarketEmptyState";
import { MarketplaceContext, marketplaceCategories, statusColors, statusConfig, getCategoryDisplayName } from "./ItemCatalog";

function AllItemsTab() {
  const {
    allItems,
    marketSearchText,
    setMarketSearchText,
    marketListView,
    setMarketListView,
    marketCategory,
    setMarketCategory,
    handlePurchase,
  } = useContext(MarketplaceContext);

  const filteredMarketItems = useMemo(() => {
    if (!allItems?.length) return [];
    let filtered = [...allItems];
    if (marketCategory !== "all") {
      filtered = filtered.filter((item) => item.category === marketCategory);
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
  }, [allItems, marketCategory, marketSearchText]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col gap-4">
        <MarketSearchBar
          marketSearchText={marketSearchText}
          setMarketSearchText={setMarketSearchText}
          marketListView={marketListView}
          setMarketListView={setMarketListView}
        />
        <MarketFilterButtons
          marketView="all_items"
          marketCategory={marketCategory}
          setMarketCategory={setMarketCategory}
          filteredMarketItems={filteredMarketItems}
          marketplaceCategories={marketplaceCategories}
          userItemStatuses={[]}
          statusColors={statusColors}
        />
      </div>
      {filteredMarketItems.length === 0 ? (
        <MarketEmptyState marketView="all_items" />
      ) : (
        <MarketItemList
          marketListView={marketListView}
          marketView="all_items"
          filteredMarketItems={filteredMarketItems}
          handlePurchase={handlePurchase}
          getCategoryDisplayName={getCategoryDisplayName}
          statusColors={statusColors}
          statusConfig={statusConfig}
        />
      )}
    </div>
  );
}

export default AllItemsTab;