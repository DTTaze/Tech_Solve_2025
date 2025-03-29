import { useState } from "react";
import { Minus, Plus } from "lucide-react";

export default function QuantityInput({ min = 0, max = 10, value = 1, onChange }) {
  const [qty, setQty] = useState(value);

  const handleChange = (newQty) => {
    if (newQty < min) newQty = min;
    if (newQty > max) newQty = max;
    setQty(newQty);
    if (onChange) onChange(newQty);
  };

  return (
    <div className="flex items-center border rounded-md overflow-hidden w-28">
      <button
        className="w-10 h-10 flex items-center justify-center border-r disabled:opacity-50"
        onClick={() => handleChange(qty - 1)}
        disabled={qty <= min}
      >
        <Minus className="w-4 h-4" />
      </button>
      <input
        type="number"
        className="w-full text-center outline-none"
        value={qty}
        onChange={(e) => handleChange(parseInt(e.target.value) || min)}
        min={min}
        max={max}
      />
      <button
        className="w-10 h-10 flex items-center justify-center border-l disabled:opacity-50"
        onClick={() => handleChange(qty + 1)}
        disabled={qty >= max}
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
