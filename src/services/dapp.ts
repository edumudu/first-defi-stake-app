import { Contract, providers } from 'ethers';

import DappToken from '../abis/DappToken.json';

export const getDappContract = async (
  rpcProvider: providers.JsonRpcProvider,
  wallet: providers.JsonRpcSigner,
) => {
  const { chainId } = await rpcProvider.getNetwork();
  const networkId = chainId.toString() as '1337';
  const dappTokenData = DappToken.networks[networkId];

  if (!dappTokenData) throw new Error('DappToken contract not deployed to detected network.');

  return new Contract(dappTokenData.address, DappToken.abi, wallet);
};
