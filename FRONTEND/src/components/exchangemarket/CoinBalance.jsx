import { Coins } from "lucide-react"
import { motion } from "framer-motion"

export default function CoinBalance({ coins }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center">
        <Coins className="h-6 w-6 text-amber-600 mr-2" />
        <span className="font-medium">Your Balance</span>
      </div>
      <motion.div
        key={coins} // Kích hoạt animation khi số coin thay đổi
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="text-xl font-bold text-amber-600"
      >
        {coins.toLocaleString()} coins
      </motion.div>
    </div>
  )
}
