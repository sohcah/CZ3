import "tailwindcss/tailwind.css";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Coiny&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
        {/* <link href="https://fonts.googleapis.com/css2?family=Coiny&family=Lilita+One&display=swap" rel="stylesheet"></link> */}
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
