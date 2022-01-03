import { FC } from 'react';
import { Link, Button } from '@mui/material';

import { shortenAddress } from '../../utils/address';

import { Wrapper, WrapperNav } from './styles';

export type NavbarProps = {
  account: string
  onConnectWallet: () => void
};

const Navbar: FC<NavbarProps> = ({ account, onConnectWallet }) => (
  <Wrapper className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
    <WrapperNav>
      <Link
        href="#!"
        underline="none"
        color="inherit"
      >
        DApp Token Farm
      </Link>

      <small>
        {account ? shortenAddress(account) : (
          <Button onClick={onConnectWallet}>
            Connect Wallet
          </Button>
        )}
      </small>
    </WrapperNav>
  </Wrapper>
);

export default Navbar;
