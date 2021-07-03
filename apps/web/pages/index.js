import Head from 'next/head'
import { useEffect, useState } from 'react';

export default function Home() {
  const [l, setL] = useState(false);
  useEffect(() => {
    setL(typeof window !== "undefined" && localStorage.CUPPAZEE_TEAKENS && localStorage.migrated !== "2")
  }, [])
  return (
    <div>
      <Head>
        <title>CuppaZee</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-stretch w-full">
        {l && <section key="migrate" className="bg-black text-white lg:min-h-[200px] flex flex-col lg:flex-row px-4 py-8 lg:px-20 items-center text-center lg:text-left">
          <div className="flex-grow">
            <h1 className="text-3xl font-bold">Migrate CuppaZee Max Data</h1>
            <h2 className="text-l">It looks like you haven't migrated your data from cuppazee.app to max.cuppazee.app.</h2>
            <button onClick={() => {
              const migrationData = Object.assign({}, localStorage);
              delete migrationData["@czexpress/dbcache"]
              localStorage.migrated = "2"
              location.href = "https://max.cuppazee.app/migration.html?t=" + Date.now() + "#" + encodeURIComponent(JSON.stringify(migrationData))
            }} className="bg-[#03C35B] text-black p-2 rounded-md">Migrate your Data</button>
          </div>
        </section>}
        <section key="max" className="bg-[#03C35B] min-h-[400px] lg:min-h-[600px] flex flex-col lg:flex-row-reverse px-4 py-8 lg:px-20 items-center text-center lg:text-right">
          <img src="/max.png" className="max-h-[500px] lg:max-w-[40%]" />
          <div className="lg:flex-grow">
            <h1 className="text-4xl lg:text-6xl font-bold">CuppaZee Max</h1>
            <h2 className="text-3xl lg:text-4xl">Feature Packed.</h2>
            <h3 className="text-1xl"><a href="https://max.cuppazee.app">https://max.cuppazee.app</a></h3>
          </div>
          <div className="flex flex-row flex-wrap justify-center w-100 lg:w-auto lg:flex-col align-center">
            <a href="https://apps.apple.com/us/app/cuppazee-max/id1514563308"><img src="/appstore.svg" className="h-12 md:h-16 m-1" /></a>
            <a href="https://play.google.com/store/apps/details?id=uk.cuppazee.paper"><img src="/googleplay.svg" className="h-12 md:h-16 m-1" /></a>
            <a href="https://max.cuppazee.app/"><img src="/pwa.png" className="h-12 md:h-16 m-1" /></a>
          </div>
        </section>
        <section key="express" className="bg-[#43BCCA] min-h-[400px] lg:min-h-[600px] flex flex-col lg:flex-row px-4 py-8 lg:px-20 items-center text-center lg:text-left">
          <img src="/express.png" className="max-h-[500px]" />
          <div className="lg:flex-grow">
            <h1 className="text-4xl lg:text-6xl font-bold">CuppaZee Express</h1>
            <h2 className="text-3xl lg:text-4xl">Simple. Fast. Effective.</h2>
            <h3 className="text-1xl">Beta Testing: <a href="https://facebook.com/groups/cuppazee">https://facebook.com/groups/cuppazee</a></h3>
            {/* <h3 className="text-3xl"><a href="https://express.cuppazee.app">https://express.cuppazee.app</a></h3> */}
          </div>
          {/* <div className="flex flex-row flex-wrap justify-center w-100 lg:w-auto lg:flex-col align-center">
            <a href="https://apps.apple.com/us/app/cuppazee-express/id1570474744"><img src="/appstore.svg" className="h-12 md:h-16 m-1" /></a>
            <a href="https://play.google.com/store/apps/details?id=app.cuppazee.express"><img src="/googleplay.svg" className="h-12 md:h-16 m-1" /></a>
            <a href="https://express.cuppazee.app/"><img src="/pwa.png" className="h-12 md:h-16 m-1" /></a>
          </div> */}
        </section>
        <section key="painter" className="bg-[#af4eff] lg:min-h-[300px] flex flex-col lg:flex-row px-4 py-8 lg:px-20 items-center text-center lg:text-left">
          {/* <img src="/max.png" className="h-[80%] max-h-[500px] lg:max-w-[40%]" /> */}
          <div className="flex-grow">
            <h1 className="text-4xl lg:text-6xl font-bold">CuppaZee Create</h1>
            <h2 className="text-3xl lg:text-4xl">Design. Publish. Deploy.</h2>
            <h3 className="text-1xl">Coming Soon</h3>
            {/* <h3 className="text-3xl"><a href="https://max.cuppazee.app">https://max.cuppazee.app</a></h3> */}
          </div>
          {/* <div>
            <a href=""><img src="/appstore.svg" className="h-16 my-2" /></a>
            <a href="https://play.google.com/store/apps/details?id=uk.cuppazee.paper"><img src="/googleplay.svg" className="h-16 my-2" /></a>
            <a href="https://max.cuppazee.app/"><img src="/pwa.png" className="h-16 my-2" /></a>
          </div> */}
        </section>
        {/* <section className="bg-[#ffd95c] lg:min-h-[300px] flex flex-col lg:flex-row px-4 py-8 lg:px-20 items-center text-center lg:text-left"> */}
          {/* <img src="/max.png" className="h-[80%] max-h-[500px] lg:max-w-[40%]" /> */}
          {/* <div className="flex-grow">
            <h1 className="text-4xl lg:text-6xl font-bold">CuppaZee Extension</h1>
            <h2 className="text-3xl lg:text-4xl">Better Munzee Map.</h2>
            <h3 className="text-3xl">Coming Soon</h3> */}
            {/* <h3 className="text-3xl"><a href="https://max.cuppazee.app">https://max.cuppazee.app</a></h3> */}
          {/* </div> */}
          {/* <div>
            <a href=""><img src="/appstore.svg" className="h-16 my-2" /></a>
            <a href="https://play.google.com/store/apps/details?id=uk.cuppazee.paper"><img src="/googleplay.svg" className="h-16 my-2" /></a>
            <a href="https://max.cuppazee.app/"><img src="/pwa.png" className="h-16 my-2" /></a>
          </div> */}
        {/* </section> */}
      </main>

      <footer className="bg-black text-white flex flex-row justify-center w-full h-24">
        <a
          className="flex flex-grow items-center justify-center"
          href="https://sohcah.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          Developed by Sam Hindess
        </a>
      </footer>
    </div>
  )
}
