import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import store from './store/store';
import { SnackbarProvider } from 'notistack';

ReactDOM.render(
  <SnackbarProvider maxSnack={3}>
    <Provider store={store}>
      <App />
    </Provider>
  </SnackbarProvider>,
  document.getElementById('root')
);

serviceWorker.unregister();
