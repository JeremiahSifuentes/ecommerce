import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Layout } from '../components'
import '../styles/globals.css'
import { StateContext } from '../context/StateContext';


function MyApp({ Component, pageProps }) {
  return (
    // Wrapping data in state context allows context to be available to app
    <StateContext >
      <Layout>
        <Toaster />
        <Component {...pageProps} />
      </Layout>
    </StateContext>
  )
}

export default MyApp
