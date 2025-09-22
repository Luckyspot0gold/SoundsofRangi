// services/monetizationService.ts
export class MonetizationService {
  private apiKey: string;
  private baseURL = 'https://api.rangis.world';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async processSubscription(userId: string, plan: 'basic' | 'pro' | 'enterprise') {
    const response = await fetch(`${this.baseURL}/subscriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        plan,
        features: this.getPlanFeatures(plan)
      })
    });

    if (!response.ok) throw new Error('Subscription processing failed');
    return response.json();
  }

  private getPlanFeatures(plan: string): string[] {
    return {
      basic: ['real-time-data', 'basic-harmonics'],
      pro: ['all-basic', 'advanced-indicators', 'historical-data'],
      enterprise: ['all-pro', 'api-access', 'white-label', 'priority-support']
    }[plan] || [];
  }
}
