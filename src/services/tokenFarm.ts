import { BigNumber, Contract, providers } from 'ethers';

import TokenFarm from '../abis/TokenFarm.json';

export const getTokenFarmContract = async (
  rpcProvider: providers.JsonRpcProvider,
  wallet: providers.JsonRpcSigner,
) => {
  const { chainId } = await rpcProvider.getNetwork();
  const networkId = chainId.toString() as '1337';
  const tokenFarmData = TokenFarm.networks[networkId];

  if (!tokenFarmData) throw new Error('TokenFarm contract not deployed to detected network.');

  return new Contract(tokenFarmData.address, TokenFarm.abi, wallet);
};

export const tokenFarmStakeDai = async (
  daiToken: Contract,
  tokenFarm: Contract,
  amount: BigNumber,
) => {
  try {
    const tx = await daiToken.approve(tokenFarm.address, amount);

    await tx.wait();

    const stakeTx = await tokenFarm.stakeTokens(amount);

    await stakeTx.wait();
  } catch (error) {
    // @ts-ignore
    if (error.code === 4001) throw new Error('User denied transaction signature');

    throw error;
  }
};

export const tokenFarmUnstakeDai = async (tokenFarm: Contract) => {
  const tx = await tokenFarm.unstakeTokens();

  return tx.wait();
};
