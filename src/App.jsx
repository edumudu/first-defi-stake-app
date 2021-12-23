import React, { useEffect, useState } from 'react';
import { providers, Contract, utils } from 'ethers';

import TheHeader from './components/Navbar';
import Main from './components/Main';

import DaiToken from './abis/DaiToken.json';
import DappToken from './abis/DappToken.json';
import TokenFarm from './abis/TokenFarm.json';

const App = () => {
  const [metamaskProvider, setMetamaskProvider] = useState(null);
  const [userAddress, setUserAddress] = useState('');
  const [daiToken, setDaiToken] = useState({});
  const [dappToken, setDappToken] = useState({});
  const [tokenFarm, setTokenFarm] = useState({});
  const [daiTokenBalance, setDaiTokenBalance] = useState('0');
  const [dappTokenBalance, setDappTokenBalance] = useState();
  const [stakingBalance, setStakingBalance] = useState('0');
  const [isLoading, setIsLoading] = useState(true);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      const provider = new providers.Web3Provider(window.ethereum, 'any');
      const [address] = await provider.listAccounts();

      setMetamaskProvider(new providers.Web3Provider(window.ethereum));
      setUserAddress(address);
    } else {
      alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  };

  const loadBlockchainData = async () => {
    if (!metamaskProvider || !userAddress) return;

    const rcpProvider = new providers.JsonRpcProvider('HTTP://192.168.160.1:7545');
    const { chainId: networkId } = await rcpProvider.getNetwork();

    // Load DaiToken
    const daiTokenData = DaiToken.networks[networkId];

    if (daiTokenData) {
      const daiToken = new Contract(daiTokenData.address, DaiToken.abi, metamaskProvider.getSigner());
      const daiTokenBalance = await daiToken.balanceOf(userAddress);

      setDaiToken(daiToken);
      setDaiTokenBalance(daiTokenBalance);
    } else {
      alert('DaiToken contract not deployed to detected network.');
    }

    // Load DappToken
    const dappTokenData = DappToken.networks[networkId];

    if (dappTokenData) {
      const dappToken = new Contract(dappTokenData.address, DappToken.abi, metamaskProvider);
      const dappTokenBalance = await dappToken.balanceOf(userAddress);

      setDappToken(dappToken);
      setDappTokenBalance(dappTokenBalance);
    } else {
      alert('DappToken contract not deployed to detected network.');
    }

    // Load TokenFarm
    const tokenFarmData = TokenFarm.networks[networkId];

    if (tokenFarmData) {
      const tokenFarm = new Contract(tokenFarmData.address, TokenFarm.abi, metamaskProvider.getSigner());
      const stakingBalance = await tokenFarm.stakingBalance(userAddress);

      setTokenFarm(tokenFarm);
      setStakingBalance(stakingBalance);
    } else {
      alert('TokenFarm contract not deployed to detected network.');
    }

    setIsLoading(false);
  };

  const stakeTokens = async (amount) => {
    setIsLoading(true);

    try {
      const tx = await daiToken.approve(tokenFarm.address, amount);

      await tx.wait();

      const stakeTx = await tokenFarm.stakeTokens(amount);

      await stakeTx.wait();
    } catch (error) {
      if (error.code === 4001) return console.log('User denied transaction signature');

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const unstakeTokens = async (amount) => {
    setIsLoading(true);

    await tokenFarm.unstakeTokens();

    setIsLoading(false);
  };

  useEffect(() => loadWeb3(), []);
  useEffect(() => loadBlockchainData(), [userAddress, metamaskProvider]);

  return (
    <div>
      <TheHeader account={userAddress} />

      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
            <div className="content mr-auto ml-auto">
              {isLoading ? (
                <p id="loader" className="text-center">Loading...</p>
              ) : (
                <Main
                  daiTokenBalance={daiTokenBalance}
                  dappTokenBalance={dappTokenBalance}
                  stakingBalance={stakingBalance}
                  stakeTokens={stakeTokens}
                  unstakeTokens={unstakeTokens}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
