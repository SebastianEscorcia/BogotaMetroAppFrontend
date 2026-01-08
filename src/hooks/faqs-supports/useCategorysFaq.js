import { useEffect, useState } from "react";
import { getAllsFaqCategorys } from "../../services";

export function useCategoryFaq() {
  const [faqCategorys, setFaqCategorys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllsFaqCategorys(); 
        setFaqCategorys(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { faqCategorys, loading, error };
}
