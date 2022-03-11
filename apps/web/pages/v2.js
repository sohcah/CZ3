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
            <h2 className="font-coiny text-3xl lg:text-4xl text-center">CuppaZee</h2>
            <div className="flex-grow" />
            {/*  href="https://web.cuppazee.app/" */}
            <a className="bg-green-500 opacity-80 cursor-not-allowed rounded-md py-2 px-4">
              Open in Browser
            </a>
          </div>
        </header>
        <section key="top" className="flex flex-col">
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
          className="bg-[#03C35B55] dark:bg-[#03C35B33] border-[#03C35B]"
        />

        <Section
          title="CuppaZee Browse"
          subtitle="The Munzee Website. Refined."
          // link="https://cuppazee.app/browse"
          comingSoon
          className="bg-[#ffd95c55] dark:bg-[#ffd95c33] border-[#ffd95c]"
        />

        <Section
          title="CuppaZee Create"
          subtitle="Design. Publish. Deploy."
          comingSoon
          className="bg-[#af4eff55] dark:bg-[#af4eff33] border-[#af4eff]"
        />
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
