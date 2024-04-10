// src/lib/apiCache.js

let cache = {
    data: null,
    lastFetch: 0
};

const ONE_DAY_IN_MS = 1000; // 24 hours in milliseconds

export function shouldFetchNewData() {
    const now = Date.now();
    return (now - cache.lastFetch) > ONE_DAY_IN_MS;
}

export function getCachedData() {
    return cache.data;
}

export function setCachedData(data) {
    cache.data = data;
    cache.lastFetch = Date.now();
}
