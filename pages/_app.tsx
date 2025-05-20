// pages/_app.tsx
import React from 'react'
import '../styles/global.css';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from '../redux/store';


function MyApp({ Component, pageProps }) {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Component {...pageProps} />
          <ToastContainer position="top-right" autoClose={3000} />
        </PersistGate>
      </Provider>

    </>

  )
}

export default MyApp
