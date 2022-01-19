# Defi Staker

## Setup

You need start ganache, and configure in `.env` file the network. After this setup the project

```bash
# Install dependencies
yarn --frozen-lockfile

# Run migrations to deploy Contracts
yarn truffle deploy

# Start dev server
yarn start

# Runs function to issue tokens to stakers
truffle exec scripts/issue-token.js
```
