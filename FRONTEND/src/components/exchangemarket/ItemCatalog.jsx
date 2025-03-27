import { useState } from "react"
import ItemCard from "./ItemCard"
import CoinBalance from "./CoinBalance"
import PurchaseModal from "./PurchaseModal"

export default function ItemCatalog({ items }) {
  const [userCoins, setUserCoins] = useState(1000)
  const [selectedItem, setSelectedItem] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handlePurchase = (item) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const confirmPurchase = () => {
    if (selectedItem && userCoins >= selectedItem.price) {
      setUserCoins(userCoins - selectedItem.price)
      setIsModalOpen(false)
      alert(`Successfully exchanged for ${selectedItem.name}!`)
    }
  }

  return (
    <div>
      <CoinBalance coins={userCoins} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} onPurchase={handlePurchase} disabled={userCoins < item.price} />
        ))}
      </div>

      {selectedItem && (
        <PurchaseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          item={selectedItem}
          userCoins={userCoins}
          onConfirm={confirmPurchase}
        />
      )}
    </div>
  )
}
