import Head from "next/head";
import MigrateMaxData from "../components/migrate";
import { Icon  } from "@mdi/react";
import { mdiAppleIos, mdiAppleSafari, mdiFirefox, mdiGoogleChrome, mdiMicrosoftEdge } from "@mdi/js";

export default function Home() {
  let available = ["Your Browser", false];
  if (typeof navigator !== "undefined") {
    if(navigator.userAgent.indexOf("Chrome") !== -1) {
      available = ["Chrome", "https://chrome.google.com/webstore/detail/cuppazee-browse/dgddkeakbmjcmnhekhdncbiaipbemfgo"];
      if ("userAgentData" in navigator && navigator.userAgentData.brands.some(i => i.brand === "Microsoft Edge")) {
        available[0] = "Microsoft Edge";
      }
    } else if (navigator.userAgent.indexOf("Firefox") !== -1) {
      available = ["Firefox", false];
    }
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>CuppaZee</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col font-display items-stretch w-full bg-white dark:bg-gray-800 dark:text-gray-100 flex-grow">
        <MigrateMaxData />
        <header
          key="header"
          className="bg-white dark:bg-gray-900 dark:text-gray-100 sticky top-0 h-[48px] lg:h-[56px] flex flex-col items-center drop-shadow-lg px-4">
          <div className="flex flex-grow w-full max-w-[1200px] items-center justify-start">
            {/* <img src="/express.png" className="max-h-[500px]" /> */}
            <a href="/">
              <h2 className="font-coiny text-3xl lg:text-4xl text-center">
                CuppaZee&nbsp;<span className="text-[#ffd95c]">Browse</span>
              </h2>
            </a>
            <div className="flex-grow" />
            {/*  href="https://web.cuppazee.app/" */}
            {!!available[1] && (
              <a href={available[1]} target="_blank" className="bg-green-500 rounded-md py-2 px-4">
                Get for {available[0]}
              </a>
            )}
          </div>
        </header>
        <section key="top" className="flex flex-col">
          {/* <img src="/express.png" className="max-h-[500px]" /> */}
          <div className="lg:flex-grow px-4 py-8 lg:p-20">
            <h2 className="font-extrabold text-5xl lg:text-7xl xl:text-8xl text-center font-display">
              Munzee Website
            </h2>
            <h2
              className="
            font-extrabold text-5xl lg:text-7xl xl:text-9xl text-[#ffd95c] text-center color-green font-display
            text-transparent bg-clip-text bg-gradient-to-br from-[#ffce2e] to-[#e0ac00]
            dark:from-[#ffe89b] dark:to-[#ffc919]
            
            ">
              {/* dark:from-green-600 dark:to-green-300 */}
              Refined
            </h2>
            {/* <h3 className="text-3xl lg:text-2xl lg:font-semibold xl:text-4xl whitespace-nowrap">
              <a href="https://express.cuppazee.app">→ https://express.cuppazee.app</a>
            </h3> */}
            <p className="text-center text-lg lg:text-2xl xl:text-5xl font-display font-semibold pt-4">
              A browser extension to make the Munzee website better.
            </p>
            <div className="flex flex-row p-4 gap-4 justify-center flex-wrap">
              <a
                target="_blank"
                href="https://chrome.google.com/webstore/detail/cuppazee-browse/dgddkeakbmjcmnhekhdncbiaipbemfgo">
                <Icon size={4} path={mdiMicrosoftEdge} />
              </a>
              <a
                target="_blank"
                href="https://chrome.google.com/webstore/detail/cuppazee-browse/dgddkeakbmjcmnhekhdncbiaipbemfgo">
                <Icon size={4} path={mdiGoogleChrome} />
              </a>
              <Icon
                title="Coming soon"
                onClick={() =>
                  alert(
                    "CuppaZee Browse is currently only available in Chromium-based browsers. We are working hard to support other browsers soon."
                  )
                }
                className="opacity-25 cursor-not-allowed"
                size={4}
                path={mdiAppleIos}
              />
              <Icon
                title="Coming soon"
                onClick={() =>
                  alert(
                    "CuppaZee Browse is currently only available in Chromium-based browsers. We are working hard to support other browsers soon."
                  )
                }
                className="opacity-25 cursor-not-allowed"
                size={4}
                path={mdiFirefox}
              />
              <Icon
                title="Coming soon"
                onClick={() =>
                  alert(
                    "CuppaZee Browse is currently only available in Chromium-based browsers. We are working hard to support other browsers soon."
                  )
                }
                className="opacity-25 cursor-not-allowed"
                size={4}
                path={mdiAppleSafari}
              />
            </div>
          </div>
        </section>

        {/* <section
          key="express"
          className="bg-[#43BCCA] dark:bg-transparent min-h-[400px] lg:min-h-[600px] flex flex-col lg:flex-row px-4 py-8 lg:px-20 items-center text-center lg:text-left">
          <img src="/express.png" className="max-h-[500px]" />
          <div className="lg:flex-grow">
            <h1
              className="
              text-4xl lg:text-6xl font-bold
              dark:text-[#43BCCA]
            ">
              CuppaZee Express
            </h1>
            <h2 className="text-3xl lg:text-4xl">Simple. Fast. Effective.</h2>
            <h3 className="text-3xl lg:text-2xl lg:font-semibold xl:text-4xl whitespace-nowrap">
              <a href="https://express.cuppazee.app">→ https://express.cuppazee.app</a>
            </h3>
          </div>
          <div className="flex flex-row flex-wrap justify-center w-100 lg:w-auto lg:flex-col align-center">
            <a href="https://apps.apple.com/us/app/cuppazee-express/id1570474744">
              <img src="/appstore.svg" className="h-12 md:h-16 m-1" />
            </a>
            <a href="https://play.google.com/store/apps/details?id=app.cuppazee.express">
              <img src="/googleplay.svg" className="h-12 md:h-16 m-1" />
            </a>
            <a href="https://express.cuppazee.app/">
              <img src="/pwa.png" className="h-12 md:h-16 m-1" />
            </a>
          </div>
        </section> */}
      </main>

      <footer className="bg-gray-900 text-white flex flex-row justify-center w-full h-24">
        <a
          className="flex flex-grow items-center justify-center"
          href="https://sohcah.dev"
          target="_blank"
          rel="noopener noreferrer">
          CuppaZee is developed by Sam Hindess.
        </a>
      </footer>
    </div>
  );
}
