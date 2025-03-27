import ItemCatalog from "../components/exchangemarket/ItemCatalog"
import { items } from "../data/data"

export default function ExchangeMarket() {
  return (
    <main className="container px-4 py-8 mt-20">
      <ItemCatalog items={items} />
    </main>
  )
}