import Head from "next/head";
import MigrateMaxData from "./migrate";

export default function ContinueWith(paths) {
  return (
    <div className="flex flex-col min-h-[100vh]">
      <Head>
        <title>CuppaZee</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-grow flex-col items-stretch w-full">
        {paths.max && <MigrateMaxData />}
        {paths.max && (
          <a className="flex flex-grow" href={paths.max}>
            <section
              key="max"
              className="bg-[#03C35B] min-h-[300px] flex flex-col flex-grow lg:flex-row px-4 py-8 lg:px-20 items-center justify-center lg:justify-start text-center lg:text-left">
              <div className="lg:flex-grow">
                <h1 className="text-4xl lg:text-5xl font-bold">Continue with CuppaZee Max</h1>
              </div>
              <div className="flex flex-row flex-wrap justify-center w-100 lg:w-auto lg:flex-col align-center">
                <a href="https://apps.apple.com/us/app/cuppazee-max/id1514563308">
                  <img src="/appstore.svg" className="h-12 md:h-16 m-1" />
                </a>
                <a href="https://play.google.com/store/apps/details?id=uk.cuppazee.paper">
                  <img src="/googleplay.svg" className="h-12 md:h-16 m-1" />
                </a>
                <a href={paths.max}>
                  <img src="/pwa.png" className="h-12 md:h-16 m-1" />
                </a>
              </div>
            </section>
          </a>
        )}
        {paths.express && (
          <a className="flex flex-grow" href={paths.express}>
            <section
              key="express"
              className="bg-[#43BCCA] min-h-[300px] flex flex-col flex-grow lg:flex-row px-4 py-8 lg:px-20 items-center justify-center lg:justify-start text-center lg:text-left">
              <div className="lg:flex-grow">
                <h1 className="text-4xl lg:text-5xl font-bold">Continue with CuppaZee Express</h1>
              </div>
              <div className="flex flex-row flex-wrap justify-center w-100 lg:w-auto lg:flex-col align-center">
                <a href="https://apps.apple.com/us/app/cuppazee-express/id1570474744">
                  <img src="/appstore.svg" className="h-12 md:h-16 m-1" />
                </a>
                <a href="https://play.google.com/store/apps/details?id=app.cuppazee.express">
                  <img src="/googleplay.svg" className="h-12 md:h-16 m-1" />
                </a>
                <a href={paths.express}>
                  <img src="/pwa.png" className="h-12 md:h-16 m-1" />
                </a>
              </div>
            </section>
          </a>
        )}
      </main>

      <footer className="bg-black text-white flex flex-row justify-center w-full h-24">
        <a
          className="flex flex-grow items-center justify-center"
          href="https://sohcah.dev"
          target="_blank"
          rel="noopener noreferrer">
          Developed by Sam Hindess
        </a>
      </footer>
    </div>
  );
}
