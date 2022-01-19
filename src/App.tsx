import { useEffect, useContext } from 'react';
import { CssBaseline } from '@mui/material';

import { ProvidersContext } from './contexts/providers';

import TheHeader from './components/TheHeader';
import Main from './views/MainPage';

const App = () => {
  const { loadProviders } = useContext(ProvidersContext);

  useEffect(loadProviders, [loadProviders]);

  return (
    <div>
      <CssBaseline />
      <TheHeader />

      <main style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Main />
      </main>
    </div>
  );
};

export default App;
