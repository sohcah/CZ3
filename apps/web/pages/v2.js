import Head from "next/head";
import MigrateMaxData from "../components/migrate";
import { Section } from "../components/section";

export default function Home() {
  return (
    <div>
      <Head>
        <title>CuppaZee</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col font-display items-stretch w-full bg-white dark:bg-gray-800 dark:text-gray-100 ">
        <MigrateMaxData />
        <header
          key="header"
          className="bg-white dark:bg-gray-900 dark:text-gray-100 sticky top-0 h-[48px] lg:h-[56px] flex flex-col items-center drop-shadow-lg px-4">
          <div className="flex flex-grow w-full max-w-[1200px] items-center justify-start">
            {/* <img src="/express.png" className="max-h-[500px]" /> */}
            <h2 className="font-coiny text-3xl lg:text-4xl text-center">CuppaZee</h2>
            <div className="flex-grow" />
            {/*  href="https://web.cuppazee.app/" */}
            <a className="bg-green-500 opacity-80 cursor-not-allowed rounded-md py-2 px-4">
              Open in Browser
            </a>
          </div>
        </header>
        <section key="top" className="flex flex-col">
          {/* <img src="/express.png" className="max-h-[500px]" /> */}
          <div className="lg:flex-grow px-4 py-8 lg:p-20">
            <h2 className="font-extrabold text-5xl lg:text-7xl xl:text-8xl text-center font-display">
              Enhancing your
            </h2>
            <h2
              className="
            font-extrabold text-4xl lg:text-6xl xl:text-8xl text-green-500 text-center color-green font-display
            text-transparent bg-clip-text bg-gradient-to-br from-green-400  to-green-700
            dark:from-green-600 dark:to-green-300
            ">
              Munzee Gameplay
            </h2>
            {/* <h3 className="text-3xl lg:text-2xl lg:font-semibold xl:text-4xl whitespace-nowrap">
              <a href="https://express.cuppazee.app">→ https://express.cuppazee.app</a>
            </h3> */}
            <p className="text-center text-lg lg:text-2xl xl:text-5xl font-display font-semibold pt-4">
              We make the tools you need to play Munzee better!
            </p>
          </div>
        </section>

        <Section
          title="CuppaZee Express"
          subtitle="Simple. Fast. Effective."
          link="https://express.cuppazee.app"
          image="/express.png"
          apps={{
            apple: "https://apps.apple.com/us/app/cuppazee-express/id1570474744",
            google: "https://play.google.com/store/apps/details?id=com.cuppazee.express",
            pwa: "https://express.cuppazee.app/",
          }}
          // titleClassName="dark:text-[#43BCCA]"
          className="bg-[#43BCCA55] dark:bg-[#43BCCA33] border-[#43BCCA]"
        />

        <Section
          title="CuppaZee Max"
          subtitle="Feature Packed."
          link="https://max.cuppazee.app"
          image="/max2.png"
          apps={{
            apple: "https://apps.apple.com/us/app/cuppazee-express/id1570474744",
            google: "https://play.google.com/store/apps/details?id=com.cuppazee.express",
            pwa: "https://express.cuppazee.app/",
          }}
          // titleClassName="dark:text-[#03C35B]"
          className="bg-[#03C35B55] dark:bg-[#03C35B33] border-[#03C35B]"
        />

        <Section
          title="CuppaZee Browse"
          subtitle="The Munzee Website. Refined."
          // link="https://cuppazee.app/browse"
          comingSoon
          // titleClassName="dark:text-[#ffd95c]"
          className="bg-[#ffd95c55] dark:bg-[#ffd95c33] border-[#ffd95c]"
        />

        <Section
          title="CuppaZee Create"
          subtitle="Design. Publish. Deploy."
          comingSoon
          // titleClassName="dark:text-[#af4eff]"
          className="bg-[#af4eff55] dark:bg-[#af4eff33] border-[#af4eff]"
        />

        {/* <section
          key="express"
          className="bg-[#43BCCA55] border-4 border-[#43BCCA] rounded-xl dark:bg-transparent min-h-[400px] lg:min-h-[600px] flex flex-col lg:flex-row mx-4 my-8 px-4 py-4 lg:px-20 items-center text-center lg:text-left">
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
        </section>
        <section
          key="max"
          className="bg-[#03C35B] dark:bg-transparent min-h-[400px] lg:min-h-[600px] flex flex-col lg:flex-row-reverse px-4 py-8 lg:px-20 items-center text-center lg:text-right">
          <img src="/max2.png" className="max-h-[500px] lg:max-w-[40%]" />
          <div className="lg:flex-grow">
            <h1 className="text-4xl lg:text-6xl font-bold dark:text-[#03C35B]">CuppaZee Max</h1>
            <h2 className="text-3xl lg:text-4xl">Feature Packed.</h2>
            <h3 className="text-3xl lg:text-2xl lg:font-semibold xl:text-4xl whitespace-nowrap">
              <a href="https://max.cuppazee.app">→ https://max.cuppazee.app</a>
            </h3>
          </div>
          <div className="flex flex-row flex-wrap justify-center w-100 lg:w-auto lg:flex-col align-center">
            <a href="https://apps.apple.com/us/app/cuppazee-max/id1514563308">
              <img src="/appstore.svg" className="h-12 md:h-16 m-1" />
            </a>
            <a href="https://play.google.com/store/apps/details?id=uk.cuppazee.paper">
              <img src="/googleplay.svg" className="h-12 md:h-16 m-1" />
            </a>
            <a href="https://max.cuppazee.app/">
              <img src="/pwa.png" className="h-12 md:h-16 m-1" />
            </a>
          </div>
        </section>
        <section
          key="create"
          className="bg-[#af4eff] dark:bg-transparent lg:min-h-[300px] flex flex-col lg:flex-row px-4 py-8 lg:px-20 items-center text-center lg:text-left">
          {/* <img src="/max.png" className="h-[80%] max-h-[500px] lg:max-w-[40%]" /> * /}
          <div className="flex-grow">
            <h1 className="text-4xl lg:text-6xl font-bold dark:text-[#af4eff]">CuppaZee Create</h1>
            <h2 className="text-3xl lg:text-4xl">Design. Publish. Deploy.</h2>
            <h3 className="text-1xl">Coming Soon</h3>
            {/* <h3 className="text-3xl"><a href="https://max.cuppazee.app">https://max.cuppazee.app</a></h3> * /}
          </div>
          {/* <div>
            <a href=""><img src="/appstore.svg" className="h-16 my-2" /></a>
            <a href="https://play.google.com/store/apps/details?id=uk.cuppazee.paper"><img src="/googleplay.svg" className="h-16 my-2" /></a>
            <a href="https://max.cuppazee.app/"><img src="/pwa.png" className="h-16 my-2" /></a>
          </div> * /}
        </section>
        <section
          key="browse"
          className="bg-[#ffd95c] dark:bg-transparent lg:min-h-[300px] flex flex-col lg:flex-row-reverse px-4 py-8 lg:px-20 items-center text-center lg:text-right">
          {/* <img src="/max.png" className="h-[80%] max-h-[500px] lg:max-w-[40%]" /> * /}
          <div className="flex-grow">
            <h1 className="text-4xl lg:text-6xl font-bold dark:text-[#ffd95c]">CuppaZee Browse</h1>
            <h2 className="text-3xl lg:text-4xl">The Munzee Website. Refined.</h2>
            <h3 className="text-1xl">Coming Soon</h3>
            {/* <h3 className="text-3xl"><a href="https://max.cuppazee.app">https://max.cuppazee.app</a></h3> * /}
          </div>
          {/* <div>
            <a href=""><img src="/appstore.svg" className="h-16 my-2" /></a>
            <a href="https://play.google.com/store/apps/details?id=uk.cuppazee.paper"><img src="/googleplay.svg" className="h-16 my-2" /></a>
            <a href="https://max.cuppazee.app/"><img src="/pwa.png" className="h-16 my-2" /></a>
          </div> * /}
        </section> * /}
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
