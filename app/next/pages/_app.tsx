// causing webpack issue
import '@tamagui/core/reset.css'
import '@tamagui/font-inter/css/400.css'
import '@tamagui/font-inter/css/700.css'

import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme'
import Head from 'next/head'
import React, { useMemo } from 'react'
import type { SolitoAppProps } from 'solito'
import 'raf/polyfill'

function MyApp({ Component, pageProps }: SolitoAppProps) {
  // const [theme, setTheme] = useRootTheme()

  const contents = useMemo(() => {
    return (
      <Component {...pageProps} />
    )
  }, [pageProps])

  return (
    <>
      <Head>
        <title>CuppaZee Alpha</title>
        <meta name="description" content="CuppaZee Alpha" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/*<NextThemeProvider onChangeTheme={setTheme}>*/}
        {contents}
      {/*</NextThemeProvider>*/}
    </>
  )
}

export default MyApp
