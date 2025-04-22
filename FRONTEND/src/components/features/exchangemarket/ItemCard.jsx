import { Coins } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ItemCard({ item, onPurchase }) {
  const handlePurchase = () => {
    onPurchase(item);
  };

  return (
    <div className="flex flex-col justify-between border border-gray-300 rounded-lg overflow-hidden hover:shadow-xl transition-all">
      <div className="h-48 w-full">
        <img
          src={item.image || "../src/assets/images/default-item.webp"}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
        <p className="text-gray-600 text-sm mb-4">{item.description}</p>

        <div className="flex items-center text-amber-600 font-bold">
          <Coins className="h-4 w-4 mr-1" />
          {item.price} coins
        </div>
      </div>

      <div className="p-4 pt-0">
        <button
          onClick={handlePurchase}
          className="w-full px-4 rounded-3xl py-2 text-white bg-[#0B6E4F] cursor-pointer"
        >
          Trao đổi
        </button>
      </div>
    </div>
  );
}
