import {
  FC,
  FormEventHandler,
  useState,
  useContext,
  useCallback,
  useEffect,
} from 'react';
import { utils, BigNumber, Contract } from 'ethers';
import {
  Button,
  Input,
  Card,
  CardContent,
} from '@mui/material';

import { ProvidersContext } from '../../contexts/providers';

import { getDaiContract } from '../../services/dai';
import { getDappContract } from '../../services/dapp';
import { getTokenFarmContract, tokenFarmStakeDai, tokenFarmUnstakeDai } from '../../services/tokenFarm';

import {
  Wrapper,
  Header,
  HeaderCard,
  FormHeader,
  StakeForm,
  InputEndAdornment,
} from './styles';

import dai from '../../assets/dai.png';

export type MainPageProps = {};

const Main: FC<MainPageProps> = () => {
  const {
    rpcProvider,
    metamaskProvider,
    wallet,
    userAddress,
  } = useContext(ProvidersContext);

  const [daiToken, setDaiToken] = useState<Contract>();
  const [tokenFarm, setTokenFarm] = useState<Contract>();
  const [daiTokenBalance, setDaiTokenBalance] = useState('0');
  const [dappTokenBalance, setDappTokenBalance] = useState('0');
  const [stakingBalance, setStakingBalance] = useState('0');
  const [isStakeLoading, setIsStakeLoading] = useState(false);

  const [amount, setAmount] = useState('');

  const loadBlockchainData = useCallback(async () => {
    if (!metamaskProvider || !wallet || !rpcProvider || !userAddress) return;

    const [daiTokenContract, dappTokenData, tokenFarmContract] = await Promise.all([
      getDaiContract(rpcProvider, wallet), // Load DaiToken
      getDappContract(rpcProvider, wallet), // Load DappToken
      getTokenFarmContract(rpcProvider, wallet), // Load TokenFarm
    ]);

    setDaiToken(daiTokenContract);
    setTokenFarm(tokenFarmContract);

    const [daiBalance, dappBalance, stakedBalance] = await Promise.all([
      daiTokenContract.balanceOf(userAddress),
      dappTokenData.balanceOf(userAddress),
      tokenFarmContract.stakingBalance(userAddress),
    ]);

    setDaiTokenBalance(daiBalance);
    setDappTokenBalance(dappBalance);
    setStakingBalance(stakedBalance);
  }, [wallet, metamaskProvider, rpcProvider, userAddress]);

  const updateDaiAndStakedBalance = async () => {
    if (!daiToken || !tokenFarm) return;

    const [daiBalance, stakedBalance] = await Promise.all([
      daiToken.balanceOf(userAddress),
      tokenFarm.stakingBalance(userAddress),
    ]);

    setDaiTokenBalance(daiBalance);
    setStakingBalance(stakedBalance);
  };

  const stakeTokens = async (tokensAmount: BigNumber) => {
    if (!daiToken || !tokenFarm) return;

    setIsStakeLoading(true);

    try {
      await tokenFarmStakeDai(daiToken, tokenFarm, tokensAmount);
      await updateDaiAndStakedBalance();
    } finally {
      setIsStakeLoading(false);
    }
  };

  const unstakeTokens = async () => {
    if (!tokenFarm) return;

    setIsStakeLoading(true);

    try {
      await tokenFarmUnstakeDai(tokenFarm);
      await updateDaiAndStakedBalance();
    } finally {
      setIsStakeLoading(false);
    }
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    stakeTokens(utils.parseEther(amount));
  };

  useEffect(() => { loadBlockchainData(); }, [loadBlockchainData]);

  return (
    <Wrapper>
      <Header>
        <Card>
          <HeaderCard>
            <b>Staking Balance</b>

            {utils.formatEther(stakingBalance)}
            {' '}
            mDAI
          </HeaderCard>
        </Card>

        <Card>
          <HeaderCard>
            <b>Reward Balance</b>

            {utils.formatEther(dappTokenBalance)}
            {' '}
            DAPP
          </HeaderCard>
        </Card>
      </Header>

      <Card>
        <CardContent>
          <StakeForm onSubmit={onSubmit}>
            <FormHeader>
              <b>Stake Tokens</b>
              <span>
                Balance:
                {' '}
                {utils.formatEther(daiTokenBalance)}
              </span>
            </FormHeader>

            <Input
              placeholder="0"
              required
              fullWidth
              value={amount}
              onInput={(e) => setAmount((e.target as HTMLInputElement).value)}
              endAdornment={(
                <InputEndAdornment>
                  <img src={dai} height="32" alt="" />
                  mDAI
                </InputEndAdornment>
                )}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={isStakeLoading}
            >
              STAKE!
            </Button>

            <Button
              variant="outlined"
              fullWidth
              size="large"
              disabled={isStakeLoading}
              onClick={unstakeTokens}
            >
              UN-STAKE...
            </Button>
          </StakeForm>
        </CardContent>
      </Card>
    </Wrapper>
  );
};

export default Main;
