const TokenFarm = artifacts.require('TokenFarm');

module.exports = async function(callback) {
  let tokenFam = await TokenFarm.deployed();

  await tokenFam.issueTokens();

  console.log('Tokens issued!');

  callback();
};
