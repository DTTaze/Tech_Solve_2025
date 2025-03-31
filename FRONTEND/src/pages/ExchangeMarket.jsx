import { useEffect, useState } from "react";
import ItemCatalog from "../components/features/exchangemarket/ItemCatalog";
import { getItemsApi } from "../utils/api";

export default function ExchangeMarket() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await getItemsApi();
        if (response.success) {
          setItems(response.data);
        } else {
          setError("Failed to fetch items");
        }
      } catch (err) {
        setError("Error fetching items");
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main className="w-[80vw] m-auto mt-5">
      <ItemCatalog items={items} />
    </main>
  );
}