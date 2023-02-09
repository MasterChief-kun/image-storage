import '@/styles/globals.css'
import theme from '@/theme'
import { CacheProvider } from '@emotion/react'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import ButtonAppBar from 'components/Nav'
import createEmotionCache from 'lib/createEmoticonCache'
import { SessionProvider } from 'next-auth/react'
import Head from 'next/head'

const clientSideEmoticoncache = createEmotionCache()
// let theme = createTheme()
export default function App(props) {
  const { Component, emoticonCache = clientSideEmoticoncache, pageProps } = props;

  return (
    <CacheProvider value={emoticonCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <SessionProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline>
            <ButtonAppBar/>
            <Component {...pageProps} />
          </CssBaseline>
        </ThemeProvider>
      </SessionProvider>
    </CacheProvider>
  )
}
