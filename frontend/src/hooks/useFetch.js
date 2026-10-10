import { useEffect, useState } from 'react';
import { fetchData } from '../lib/api';

const CACHE_TTL = 30_000;
const cache = new Map();
const inFlight = new Map();

export function useFetch(path) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const cached = cache.get(path);
    if (cached && cached.expiresAt > Date.now()) {
      setData(cached.data);
      setLoading(false);
      setError(null);
      return () => {
        active = false;
      };
    }

    setLoading(true);
    setError(null);

    let promise = inFlight.get(path);
    if (!promise) {
      promise = fetchData(path)
        .then((result) => {
          cache.set(path, { data: result, expiresAt: Date.now() + CACHE_TTL });
          return result;
        })
        .finally(() => {
          inFlight.delete(path);
        });
      inFlight.set(path, promise);
    }

    promise
      .then((result) => {
        if (active) setData(result);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [path]);

  return { data, loading, error };
}
