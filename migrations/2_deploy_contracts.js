const DappToken = artifacts.require('DappToken');
const DaiToken = artifacts.require('DaiToken');
const TokenFarm = artifacts.require('TokenFarm');

module.exports = async function(deployer, network, accounts) {
  // Depploy Mock DAI Token
  await deployer.deploy(DaiToken);
  // Fetch deployed DAI Token data
  const daiToken = await DaiToken.deployed();

  // Deploy Dapp Token
  await deployer.deploy(DappToken);
  // Fetch deployed Dapp Token data
  const dappToken = await DappToken.deployed();

  // Deploy TokenFarm
  await deployer.deploy(TokenFarm, dappToken.address, daiToken.address)
  // Fetch deployed TokenFarm data
  const tokenFarm = await TokenFarm.deployed();

  // Transfer all tokens to TokenFarm (1 million)
  await dappToken.transfer(tokenFarm.address, '1000000000000000000000000');

  // Transfer 100 Mock DAI tokens to investor
  await daiToken.transfer(accounts[1], '100000000000000000000');
};
