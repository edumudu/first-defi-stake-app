const DappToken = artifacts.require('DappToken');
const DaiToken = artifacts.require('DaiToken');
const TokenFarm = artifacts.require('TokenFarm');

require('chai').use(require('chai-as-promised')).should();

const tokens = (number) => web3.utils.toWei(number, 'ether');

contract('TokenFarm', ([owner, investor]) => {
  let daiToken, dappToken, tokenFarm;

  before(async () => {
    // Load contracts
    daiToken = await DaiToken.new();
    dappToken = await DappToken.new();
    tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);

    // Transfer all Dapp tokens to farm (1 million)
    await dappToken.transfer(tokenFarm.address, tokens('1000000'));

    // Send tokens to investor (In tests is needed to inform from what address the tokens come from)
    await daiToken.transfer(investor, tokens('100'), { from: owner });
  });

  describe('Mock DAI deployment', async () => {
    it('has a name', async () => {
      const name = await daiToken.name();

      assert.equal(name, 'Mock DAI Token');
    })
  })

  describe('DApp Token deployment', async () => {
    it('has a name', async () => {
      const name = await dappToken.name();

      assert.equal(name, 'DApp Token');
    })
  })

  describe('Token Farm deployment', async () => {
    it('has a name', async () => {
      const name = await tokenFarm.name();

      assert.equal(name, 'Dapp Token Farm');
    })

    it('contract has tokens', async () => {
      let balance = await dappToken.balanceOf(tokenFarm.address);

      assert.equal(balance.toString(), tokens('1000000'));
    })
  })

  describe('Farming Tokens', async () => {
    it('rewards investors for staking mDai tokens', async () => {
      // Check investor balance before staking
      let result = await daiToken.balanceOf(investor);

      assert.equal(result.toString(), tokens('100'), 'Investor Mock DAI wallet balance correct before staking');

      // Aprove tokenFarm contract to spend tokens from investor address
      await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor });

      // Stake Mock DAI tokens
      await tokenFarm.stakeTokens(tokens('100'), { from: investor });

      // Check staking result
      result = await daiToken.balanceOf(investor);
      assert.equal(result.toString(), tokens('0'), 'Investor Mock DAI wallet balance correct after staking');

      result = await daiToken.balanceOf(tokenFarm.address);
      assert.equal(result.toString(), tokens('100'), 'Token Farm Mock DAI balance correct after staking');

      result = await tokenFarm.stakingBalance(investor);
      assert.equal(result.toString(), tokens('100'), 'investor staking balance correct after staking');

      // Issue tokens
      await tokenFarm.issueTokens({ from: owner });

      // Check balances after issuance
      result = await dappToken.balanceOf(investor);
      assert.equal(result.toString(), tokens('100'), 'investor DApp Token wallet balance correct after issuance');

      // Ensure that only owner can issue tokens
      await tokenFarm.issueTokens({ from: investor }).should.be.rejected;

      // Unstake tokens
      await tokenFarm.unstakeTokens({ from: investor });

      // Check results after unstaking
      result = await daiToken.balanceOf(investor);
      assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct after staking');

      result = await daiToken.balanceOf(tokenFarm.address);
      assert.equal(result.toString(), tokens('0'), 'Token Farm Mock DAI balance correct after unstaking');

      result = await tokenFarm.stakingBalance(investor);
      assert.equal(result.toString(), tokens('0'), 'investor staking balance correct after unstaking');

      result = await tokenFarm.isStaking(investor);
      assert.equal(result.toString(), 'false', 'investor staking status correct after unstaking');
    })
  })
})

