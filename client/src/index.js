import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { store } from './Redux/Store';
import {Provider} from 'react-redux'
import { Toaster } from "react-hot-toast";
import { SocketContextProvider } from './context/SocketContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
  <BrowserRouter>
      <Provider store={store}>
        <SocketContextProvider>
          <App />
        </SocketContextProvider>
          <Toaster/>
      </Provider>
  </BrowserRouter>
  </>
);


