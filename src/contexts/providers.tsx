import {
  createContext,
  FC,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { providers } from 'ethers';

import { useEnv } from '../hooks/useEnv';

export type ProvidersData = {
  rpcProvider?: providers.JsonRpcProvider,
  metamaskProvider?: providers.Web3Provider,
  wallet?: providers.JsonRpcSigner,
  userAddress: string;

  connectWallet: () => Promise<void>,
  loadProviders: () => void,
};

export type ProvidersProviderProps = {};

export const ProvidersContext = createContext<ProvidersData>({} as ProvidersData);

export const ProvidersProvider: FC<ProvidersProviderProps> = ({ children }) => {
  const env = useEnv();

  const [metamaskProvider, setMetamaskProvider] = useState<providers.Web3Provider>();
  const [rpcProvider, setRpcProvider] = useState<providers.JsonRpcProvider>();
  const [wallet, setWallet] = useState<providers.JsonRpcSigner>();
  const [userAddress, setUserAddress] = useState('');

  const loadProviders = useCallback(() => {
    // @ts-ignore
    const { ethereum } = window;
    const ethProvider = new providers.JsonRpcProvider(env.RPC_NETWORK);
    const maskProvider = ethereum ? new providers.Web3Provider(ethereum, 'any') : metamaskProvider;

    setRpcProvider(ethProvider);
    setMetamaskProvider(maskProvider);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [env.RPC_NETWORK]);

  const connectWallet = useCallback(async () => {
    if (!metamaskProvider) return;

    const signer = metamaskProvider.getSigner();

    try {
      await metamaskProvider.send('eth_requestAccounts', []);

      setWallet(signer);
      setUserAddress(await signer.getAddress());
    } catch (error) {
      /// @ts-ignore
      if (error.code === 4001) alert('Please connect to Metamask');
    }
  }, [metamaskProvider]);

  const providerValue = useMemo<ProvidersData>(() => ({
    rpcProvider,
    metamaskProvider,
    userAddress,
    wallet,
    connectWallet,
    loadProviders,
  }), [metamaskProvider, rpcProvider, loadProviders, connectWallet, userAddress, wallet]);

  return (
    <ProvidersContext.Provider value={providerValue}>
      {children}
    </ProvidersContext.Provider>
  );
};
