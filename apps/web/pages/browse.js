import Head from "next/head";
import MigrateMaxData from "../components/migrate";
import { Icon } from "@mdi/react";
import {
  mdiAppleIos,
  mdiAppleSafari,
  mdiFirefox,
  mdiGoogleChrome,
  mdiMicrosoftEdge,
} from "@mdi/js";
import { Section } from "../components/section";

export default function Home() {
  let available = ["Your Browser", false];
  if (typeof navigator !== "undefined") {
    if (navigator.userAgent.indexOf("Chrome") !== -1) {
      available = [
        "Chrome",
        "https://chrome.google.com/webstore/detail/cuppazee-browse/dgddkeakbmjcmnhekhdncbiaipbemfgo",
        mdiGoogleChrome,
      ];
      if (
        "userAgentData" in navigator &&
        navigator.userAgentData.brands.some(i => i.brand === "Microsoft Edge")
      ) {
        available[0] = "Microsoft Edge";
        available[2] = mdiMicrosoftEdge;
      }
    } else if (navigator.userAgent.indexOf("Firefox") !== -1) {
      available = ["Firefox", false, mdiFirefox];
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
            {!!available[1] && (
              <a href={available[1]} target="_blank" className="bg-[#ffd95c] rounded-md py-2 px-4">
                Get for {available[0]}
              </a>
            )}
          </div>
        </header>
        <section key="top" className="flex flex-col">
          <div className="flex flex-col items-center lg:flex-grow px-4 py-8 lg:p-10">
            <h2 className="font-extrabold text-5xl lg:text-6xl xl:text-7xl text-center font-display">
              Munzee Website
            </h2>
            <h2
              className="
            font-extrabold text-5xl lg:text-6xl xl:text-7xl text-[#ffd95c] text-center color-green font-display
            text-transparent bg-clip-text bg-gradient-to-br from-[#ffce2e] to-[#e0ac00]
            dark:from-[#ffe89b] dark:to-[#ffc919]
            
            ">
              Refined
            </h2>
            <p className="text-center text-lg lg:text-2xl xl:text-3xl font-display font-semibold pt-4">
              CuppaZee Browse is a browser extension to make the Munzee website better.
            </p>

            {!!available[1] ? (
              <>
                <a
                  href={available[1]}
                  target="_blank"
                  className="bg-[#ffd95c] rounded-md text-lg mt-4 py-2 px-4 flex flex-row items-center gap-4">
                  <Icon size={1.5} path={available[2]} /> Download for {available[0]}
                </a>
                <p className="text-center text-lg lg:text-xl xl:text-2xl font-display py-2">
                  or for another browser
                </p>
              </>
            ) : (
              <p className="text-center text-lg lg:text-xl xl:text-2xl font-display py-2">
                Download now for
              </p>
            )}

            <div className="flex flex-row px-4 pb-4 gap-4 justify-center flex-wrap">
              <a
                target="_blank"
                href="https://chrome.google.com/webstore/detail/cuppazee-browse/dgddkeakbmjcmnhekhdncbiaipbemfgo">
                <Icon size={2} path={mdiMicrosoftEdge} />
              </a>
              <a
                target="_blank"
                href="https://chrome.google.com/webstore/detail/cuppazee-browse/dgddkeakbmjcmnhekhdncbiaipbemfgo">
                <Icon size={2} path={mdiGoogleChrome} />
              </a>
              <Icon
                title="Coming soon"
                onClick={() =>
                  alert(
                    "CuppaZee Browse is currently only available in Chromium-based browsers. We are working hard to support other browsers soon."
                  )
                }
                className="opacity-25 cursor-not-allowed"
                size={2}
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
                size={2}
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
                size={2}
                path={mdiAppleSafari}
              />
            </div>
          </div>
        </section>

        <Section
          small
          title="Better Redeem"
          subtitle="Spend your credits, without the puzzlement."
          image="/browse_redeem.png"
          className="bg-[#aa00ff55] dark:bg-[#aa00ff33] border-[#aa00ff]"
          imageClassName="max-h-[200px] lg:max-w-[40%] mr-4 rounded-lg"
        />

        <Section
          small
          title="Better Map Sandbox"
          subtitle="Never forget to hit save again, deploy virtuals with ease."
          image="/browse_sandbox.png"
          className="bg-[#5cb85c55] dark:bg-[#5cb85c33] border-[#5cb85c]"
          imageClassName="max-h-[300px] lg:max-w-[40%] mr-4 rounded-lg"
        />

        <Section
          small
          title="Dark Mode"
          subtitle="Nobody likes going blind, so now you don't have to."
          image="/browse_dark.png"
          className="bg-[#23232355] dark:bg-[#23232333] border-[#232323]"
          imageClassName="max-h-[300px] lg:max-w-[40%] mr-4 rounded-lg"
        />

        <Section
          small
          title="Bouncer Expiry Times"
          subtitle="Don't miss that fancy bouncer in your Skyland."
          image="/browse_expiry.png"
          className="bg-[#e8a72555] dark:bg-[#e8a72533] border-[#e8a725]"
          imageClassName="max-h-[150px] lg:max-w-[40%] mr-4 rounded-lg"
        />
        <div className="text-2xl lg:text-3xl xl:text-6xl px-4 pb-4 text-center">
          ... and so much more
        </div>
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
