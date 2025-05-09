import { useMemo } from "react";
import SearchFilterBar from "./SearchFilterBar";
import MarketItemList from "./MarketItemList";
import MarketEmptyState from "./MarketEmptyState";
import { statusColors, statusConfig, getCategoryDisplayName } from "./ItemCatalog";

function RedeemTab({ 
  items, 
  searchQuery, 
  setSearchQuery, 
  sortOption, 
  setSortOption, 
  isFilterOpen, 
  setIsFilterOpen, 
  handlePurchase 
}) {
  const filteredItems = useMemo(() => {
    if (!items?.length) return [];
    return items.filter((item) => {
      if (!searchQuery) return true;
      const searchLower = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower)
      );
    });
  }, [items, searchQuery]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      switch (sortOption) {
        case "price-ascetrically": return a.price - b.price;
        case "price-descending": return b.price - a.price;
        case "name-ascending": return a.name.localeCompare(b.name);
        case "name-descending": return b.name.localeCompare(a.name);
        default: return 0;
      }
    });
  }, [filteredItems, sortOption]);

  return (
    <div className="space-y-6">
      <SearchFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortOption={sortOption}
        setSortOption={setSortOption}
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
      />
      {sortedItems.length === 0 ? (
        <MarketEmptyState marketView="redeem" />
      ) : (
        <MarketItemList
          marketListView="grid"
          marketView="redeem"
          filteredMarketItems={sortedItems}
          handlePurchase={handlePurchase}
          getCategoryDisplayName={getCategoryDisplayName}
          statusColors={statusColors}
          statusConfig={statusConfig}
        />
      )}
    </div>
  );
}

export default RedeemTab;