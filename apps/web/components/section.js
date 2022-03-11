export function Section(props) {
  return (
    <section
      key="express"
      className={`${props.className} lg:border-4 lg:rounded-xl dark:bg-transparen ${
        props.image ? "min-h-[400px] lg:min-h-[600px]" : "min-h-[200px] lg:min-h-[300px]"
      } flex flex-col lg:flex-row lg:mx-4 lg:my-4 px-4 py-4 lg:px-10 items-center text-center lg:text-left`}>
      {props.image && <img src={props.image} className="max-h-[500px] lg:max-w-[40%]" />}
      <div className="lg:flex-grow">
        <h1
          className={`
            text-4xl lg:text-6xl font-bold
            ${props.titleClassName ?? ""}
          `}>
          {props.title}
        </h1>
        <h2 className="text-3xl lg:text-4xl">{props.subtitle}</h2>
        {props.link && (
          <h3 className="text-3xl lg:text-2xl lg:font-semibold xl:text-4xl whitespace-nowrap">
            <a href={props.link}>→ {props.link}</a>
          </h3>
        )}
        {props.comingSoon && (
          <h3 className="text-3xl lg:text-2xl lg:font-semibold xl:text-4xl whitespace-nowrap">
            Coming Soon
          </h3>
        )}
      </div>
      {props.apps && (
        <div className="flex flex-row flex-wrap justify-center w-100 lg:w-auto lg:flex-col align-center">
          {props.apps.apple && (
            <a href={props.apps.apple}>
              <img src="/appstore.svg" className="h-12 md:h-16 m-1" />
            </a>
          )}
          {props.apps.google && (
            <a href={props.apps.apple}>
              <img src="/googleplay.svg" className="h-12 md:h-16 m-1" />
            </a>
          )}
          {props.apps.pwa && (
            <a href={props.apps.pwa}>
              <img src="/pwa.png" className="h-12 md:h-16 m-1" />
            </a>
          )}
        </div>
      )}
    </section>
  );
}
