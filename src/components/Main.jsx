import React, { useRef } from 'react'
import ReactDOM from 'react-dom';
import { utils } from 'ethers';
// import { Button } from '@mui/material'

import dai from '../assets/dai.png'

const Main = ({ stakingBalance, dappTokenBalance, daiTokenBalance, unstakeTokens, stakeTokens }) => {
  const input = useRef();

  const onSubmit = (event) => {
    event.preventDefault()
    const amount = utils.parseEther(input.current.value);
    stakeTokens(amount)
  }

  const onUnstakeClick = (event) => {
    event.preventDefault()
    unstakeTokens()
  }

  return (
    <div id="content" className="mt-3">
      <table className="table table-borderless text-muted text-center">
        <thead>
          <tr>
            <th scope="col">Staking Balance</th>
            <th scope="col">Reward Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{utils.formatEther(stakingBalance)} mDAI</td>
            <td>{utils.formatEther(dappTokenBalance)} DAPP</td>
          </tr>
        </tbody>
      </table>

      <div className="card mb-4" >

        <div className="card-body">

          <form className="mb-3" onSubmit={onSubmit}>
            <div>
              <label className="float-left"><b>Stake Tokens</b></label>
              <span className="float-right text-muted">
                Balance: {utils.formatEther(daiTokenBalance)}
              </span>
            </div>
            <div className="input-group mb-4">
              <input
                type="text"
                ref={input}
                className="form-control form-control-lg"
                placeholder="0"
                required />
              <div className="input-group-append">
                <div className="input-group-text">
                  <img src={dai} height='32' alt=""/>
                  &nbsp;&nbsp;&nbsp; mDAI
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block btn-lg">STAKE!</button>
          </form>
          <button
            type="submit"
            className="btn btn-link btn-block btn-sm"
            onClick={onUnstakeClick}
          >
              UN-STAKE...
            </button>
        </div>
      </div>

    </div>
  );
}

export default Main;