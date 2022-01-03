import { FC, FormEventHandler, useState } from 'react';
import { utils, BigNumber } from 'ethers';
import {
  Button,
  Input,
  Card,
  CardContent,
} from '@mui/material';

import {
  Wrapper,
  Header,
  HeaderCard,
  FormHeader,
  StakeForm,
  InputEndAdornment,
} from './styles';

import dai from '../../assets/dai.png';

export type MainPageProps = {
  stakingBalance: string,
  dappTokenBalance: string,
  daiTokenBalance: string,
  isStakeLoading: boolean,
  unstakeTokens: () => void,
  stakeTokens: (amount: BigNumber) => void,
};

const Main: FC<MainPageProps> = ({
  stakingBalance,
  dappTokenBalance,
  daiTokenBalance,
  isStakeLoading,
  unstakeTokens,
  stakeTokens,
}) => {
  const [amount, setAmount] = useState('');

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    stakeTokens(utils.parseEther(amount));
  };

  const onUnstakeClick = () => {
    unstakeTokens();
  };

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
              <span className="float-right text-muted">
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
              onClick={onUnstakeClick}
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
