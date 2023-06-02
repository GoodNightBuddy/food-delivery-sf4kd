import { ChakraProvider, ColorModeScript, theme } from '@chakra-ui/react';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Wrapper } from '@googlemaps/react-wrapper';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <Wrapper apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY || ''}>
      <Provider store={store}>
        <ChakraProvider theme={theme}>
          <BrowserRouter>
            <ColorModeScript />
            <App />
          </BrowserRouter>
        </ChakraProvider>
      </Provider>
    </Wrapper>
  </React.StrictMode>
);
