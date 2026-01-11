import { useEffect, useState } from "react";
import { getFaqSupport } from "../../services";
export const useSupportFaq = () => {
  const [supportFaq, setsupportFaq] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchFaqs = async () =>{
        try {
            const data = await getFaqSupport();
            setsupportFaq(data);
        } catch (error) {
            setError(error)
        } finally{
            setLoading(false);
        }
    };
  
    fetchFaqs();
  }, []);
  return {supportFaq,loading,error};
};
