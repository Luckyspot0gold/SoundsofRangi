class APICircuitBreaker {
  constructor() {
    this.failures = {};
    this.thresholds = {
      coinbase: 5,
      solana: 3,
      avalanche: 5
    };
  }

  async callWithFallback(apiCall, fallback, serviceName) {
    if (this.failures[serviceName] > this.thresholds[serviceName]) {
      return fallback();
    }

    try {
      const result = await apiCall();
      this.failures[serviceName] = 0;
      return result;
    } catch (error) {
      this.failures[serviceName] = (this.failures[serviceName] || 0) + 1;
      return fallback();
    }
  }
}
