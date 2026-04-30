import {useState, useEffect} from 'react';
import {fetchExample} from '../api';

export const useExample = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchExample().then(setData);
  }, []);

  return data;
};
