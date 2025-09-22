// services/xionBlockchainService.ts
import { SigningStargateClient } from '@cosmjs/stargate';

export class XIONBlockchainService {
  private client: SigningStargateClient | null = null;
  private rpcEndpoint = 'https://xion-testnet-rpc.polkachu.com';

  async connect(): Promise<void> {
    try {
      // Real XION connection
      this.client = await SigningStargateClient.connect(this.rpcEndpoint);
      
      // Verify connection by getting block height
      const block = await this.client.getBlock();
      console.log('✅ XION Connected - Block Height:', block.header.height);
    } catch (error) {
      console.error('❌ XION Connection Failed:', error);
      throw new Error('Failed to connect to XION blockchain');
    }
  }

  async getAccountBalance(address: string): Promise<string> {
    if (!this.client) throw new Error('Not connected to XION');
    
    const balance = await this.client.getBalance(address, 'uxion');
    return balance.amount;
  }

  async sendTransaction(fromAddress: string, toAddress: string, amount: string) {
    if (!this.client) throw new Error('Not connected to XION');
    
    const tx = await this.client.sendTokens(
      fromAddress,
      toAddress,
      [{ denom: 'uxion', amount }],
      'auto'
    );
    
    return tx;
  }
}
