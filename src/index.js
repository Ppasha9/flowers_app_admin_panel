import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger';
import { Provider } from 'react-redux'

import rootReducer from './redux/reducers'

import Layout from './components/layout/Layout'

import './assets/boxicons-2.0.7/css/boxicons.min.css'
import './assets/css/grid.css'
import './assets/css/theme.css'
import './assets/css/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'

const store = createStore(
  rootReducer,
  {},
  applyMiddleware(createLogger())
)

document.title = 'ORLOVE Admin Panel'

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <Layout />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);
