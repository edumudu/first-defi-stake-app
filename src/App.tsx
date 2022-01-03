import { useEffect, useState, useCallback } from 'react';
import { providers, Contract, BigNumber } from 'ethers';
import { CssBaseline } from '@mui/material';

import TheHeader from './components/TheHeader';
import Main from './views/MainPage';

import DaiToken from './abis/DaiToken.json';
import DappToken from './abis/DappToken.json';
import TokenFarm from './abis/TokenFarm.json';

const App = () => {
  const [wallet, setWallet] = useState<providers.JsonRpcSigner>();
  const [rpcProvider, setRpcProvider] = useState<providers.JsonRpcProvider>();
  const [metamaskProvider, setMetamaskProvider] = useState<providers.Web3Provider>();
  const [userAddress, setUserAddress] = useState('');
  const [daiToken, setDaiToken] = useState<Contract>();
  const [tokenFarm, setTokenFarm] = useState<Contract>();
  const [daiTokenBalance, setDaiTokenBalance] = useState('0');
  const [dappTokenBalance, setDappTokenBalance] = useState('0');
  const [stakingBalance, setStakingBalance] = useState('0');
  const [isStakeLoading, setIsStakeLoading] = useState(false);

  const loadProviders = () => {
    // @ts-ignore
    const { ethereum } = window;
    const rcpProvider = new providers.JsonRpcProvider('HTTP://172.20.0.1:7545');

    setRpcProvider(rcpProvider);

    if (ethereum) setMetamaskProvider(new providers.Web3Provider(ethereum, 'any'));
  };

  const loadBlockchainData = useCallback(async () => {
    if (!metamaskProvider || !wallet || !rpcProvider || !userAddress) return;

    const { chainId } = await rpcProvider.getNetwork();
    const networkId = chainId.toString() as '1337';

    // Load DaiToken
    const daiTokenData = DaiToken.networks[networkId];

    if (daiTokenData) {
      const daiTokenContract = new Contract(daiTokenData.address, DaiToken.abi, wallet);

      setDaiToken(daiTokenContract);
      setDaiTokenBalance(await daiTokenContract.balanceOf(userAddress));
    } else {
      alert('DaiToken contract not deployed to detected network.');
    }

    // Load DappToken
    const dappTokenData = DappToken.networks[networkId];

    if (dappTokenData) {
      const dappTokenContract = new Contract(dappTokenData.address, DappToken.abi, wallet);

      setDappTokenBalance(await dappTokenContract.balanceOf(userAddress));
    } else {
      alert('DappToken contract not deployed to detected network.');
    }

    // Load TokenFarm
    const tokenFarmData = TokenFarm.networks[networkId];

    if (tokenFarmData) {
      const tokenFarmContract = new Contract(tokenFarmData.address, TokenFarm.abi, wallet);

      setTokenFarm(tokenFarmContract);
      setStakingBalance(await tokenFarmContract.stakingBalance(userAddress));
    } else {
      alert('TokenFarm contract not deployed to detected network.');
    }
  }, [wallet, metamaskProvider, rpcProvider, userAddress]);

  const onConnectWallet = async () => {
    if (!metamaskProvider) return;

    try {
      await metamaskProvider.send('eth_requestAccounts', []);

      const signer = metamaskProvider.getSigner();

      setWallet(signer);
      setUserAddress(await signer.getAddress());
    } catch (error) {
      alert('Please connect to MetaMask!');
    }
  };

  const stakeTokens = async (amount: BigNumber) => {
    if (!daiToken || !tokenFarm) return;

    setIsStakeLoading(true);

    try {
      const tx = await daiToken.approve(tokenFarm.address, amount);

      await tx.wait();

      const stakeTx = await tokenFarm.stakeTokens(amount);

      await stakeTx.wait();
    } catch (error) {
      // @ts-ignore
      if (error.code === 4001) return console.log('User denied transaction signature');

      throw error;
    } finally {
      setIsStakeLoading(false);
    }
  };

  const unstakeTokens = async () => {
    if (!tokenFarm) return;

    setIsStakeLoading(true);

    try {
      const tx = await tokenFarm.unstakeTokens();

      await tx.wait();
    } catch (error) {
      // @ts-ignore
      if (error.code === 4001) return console.log('User denied transaction signature');

      throw error;
    } finally {
      setIsStakeLoading(false);
    }
  };

  useEffect(loadProviders, []);
  useEffect(() => { loadBlockchainData(); }, [loadBlockchainData]);

  return (
    <div>
      <CssBaseline />
      <TheHeader account={userAddress} onConnectWallet={onConnectWallet} />

      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="content mr-auto ml-auto">
              <Main
                daiTokenBalance={daiTokenBalance}
                dappTokenBalance={dappTokenBalance}
                stakingBalance={stakingBalance}
                stakeTokens={stakeTokens}
                unstakeTokens={unstakeTokens}
                isStakeLoading={isStakeLoading}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
