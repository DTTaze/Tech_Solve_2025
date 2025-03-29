import { Coins } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

export default function ItemCard({ item, onPurchase, userCoins = 0 }) {
  const [displayedCoins, setDisplayedCoins] = useState(userCoins ?? 0)

  const handlePurchase = () => {
    setDisplayedCoins((prev) => Math.max(0, prev - item.price))
    onPurchase(item)
  }

  return (
    <div className="flex flex-col justify-between border rounded-lg overflow-hidden hover:shadow-xl transition-all">
      <div className="h-48 w-full">
        <img src={item.image || "../src/assets/images/default-item.webp"} alt={item.name} className="h-full w-full object-cover" />
      </div>

      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
        <p className="text-gray-600 text-sm mb-4">{item.description}</p>

        <div className="flex items-center text-amber-600 font-bold">
          <Coins className="h-4 w-4 mr-1" />
          {item.price} coins
        </div>

        <div className="mt-2 text-gray-500 text-sm">
          Your Balance:{" "}
          <AnimatePresence mode="popLayout">
            <motion.span
              key={displayedCoins}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.3 }}
              className="text-amber-600 font-bold"
            >
              {(displayedCoins ?? 0).toLocaleString()} coins
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      <div className="p-4 pt-0">
          <button
            onClick={handlePurchase}
            className={`w-full px-4 rounded-3xl py-2 text-white bg-[#0B6E4F] cursor-pointer`}
          >
            Trao đổi 
          </button>
      </div>
    </div>
  )
}
