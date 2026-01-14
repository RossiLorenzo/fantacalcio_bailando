const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

class DataCache {
	constructor() {
		this.cache = new Map();
	}

	set(key, data) {
		this.cache.set(key, {
			data,
			timestamp: Date.now()
		});
	}

	get(key) {
		const cached = this.cache.get(key);
		if (!cached) return null;

		if (Date.now() - cached.timestamp > CACHE_DURATION) {
			this.cache.delete(key);
			return null;
		}
		return cached.data;
	}

	has(key) {
		return this.get(key) !== null;
	}

	clear() {
		this.cache.clear();
	}
}

export default new DataCache();
