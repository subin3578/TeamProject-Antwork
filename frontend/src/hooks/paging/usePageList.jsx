import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";

export const usePageList = (url, initialState = []) => {
  const [pages, setPages] = useState(initialState);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await axiosInstance.get(url);
        setPages(response.data);
      } catch (error) {
        console.error("페이지 목록을 가져오는데 실패했습니다:", error);
        setError(error);
      }
    };

    fetchPages();
  }, [url]);

  return { pages, setPages, error };
};
