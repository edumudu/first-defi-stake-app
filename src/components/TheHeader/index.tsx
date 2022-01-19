import { FC, useContext } from 'react';
import { Link, Button } from '@mui/material';

import { ProvidersContext } from '../../contexts/providers';
import { shortenAddress } from '../../utils/address';

import { Wrapper, WrapperNav } from './styles';

export type NavbarProps = {};

const Navbar: FC<NavbarProps> = () => {
  const { connectWallet, userAddress } = useContext(ProvidersContext);

  return (
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
          {userAddress ? shortenAddress(userAddress) : (
            <Button onClick={connectWallet}>
              Connect Wallet
            </Button>
          )}
        </small>
      </WrapperNav>
    </Wrapper>
  );
};

export default Navbar;
