import ItemCatalog from "../components/features/exchangemarket/ItemCatalog"
import { items } from "../data/data"

export default function ExchangeMarket() {
  return (
    <main className="w-[80vw] m-auto mt-5">
      <ItemCatalog items={items} />
    </main>
  )
}