// hooks/useRealXIONAuth.ts
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { xion } from 'wagmi/chains';

export const useRealXIONAuth = () => {
  const { connect, connectors, error, isLoading } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const connectXION = async () => {
    try {
      const xionConnector = connectors.find(c => c.id === 'xion');
      if (!xionConnector) throw new Error('XION connector not found');
      
      await connect({ connector: xionConnector, chainId: xion.id });
    } catch (err) {
      console.error('XION connection failed:', err);
      throw err;
    }
  };

  return {
    connectXION,
    disconnect,
    address,
    isConnected,
    error,
    isLoading
  };
};
