import { useEffect, useState } from 'react';
import axios from 'axios';

const useCategories = () => {
  const [categories, setCategories] = useState([]);

useEffect(() => {
  axios.get('http://localhost:8080/api/categories')
    .then((res) => {
      console.log('🔥 카테고리 응답:', res.data);  // 이거 찍어보고
      setCategories(res.data);
    })
    .catch((err) => console.error(err));
}, []);

  return categories;
};

export default useCategories;
