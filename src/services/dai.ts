import { Contract, providers } from 'ethers';

import DaiToken from '../abis/DaiToken.json';

export const getDaiContract = async (
  rpcProvider: providers.JsonRpcProvider,
  wallet: providers.JsonRpcSigner,
) => {
  const { chainId } = await rpcProvider.getNetwork();
  const networkId = chainId.toString() as '1337';
  const daiTokenData = DaiToken.networks[networkId];

  if (!daiTokenData) throw new Error('DaiToken contract not deployed to detected network.');

  return new Contract(daiTokenData.address, DaiToken.abi, wallet);
};
