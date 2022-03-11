import { useEffect, useState } from "react";

export default function V1ShutDown() {
  const [location, setLocation] = useState("")
  useEffect(() => {
    try {
      setLocation(window.location.hostname);
    } catch { };
  })
  if (location !== "v1.cuppazee.app") {
    return null;
  }
  return (
    <section
      key="migrate"
      className="bg-black text-white lg:min-h-[200px] flex flex-col lg:flex-row px-4 py-8 lg:px-20 items-center text-center lg:text-left">
      <div className="flex-grow">
        <h1 className="text-3xl font-bold">V1 Shut Down</h1>
        <h2 className="text-lg">
          As of 29th December 2021, CuppaZee V1 for Web has been shut down.
        </h2>
        <p className="text-md">
          This shut down comes almost 10 months after the initial planned shutdown date of 1st March
          2020.
          <br />
          We recommend that all remaining users of CuppaZee V1 switch to CuppaZee Max or CuppaZee
          Express.
          <br />
          If you have any questions, please contact us at{" "}
          <a href="mailto:support@cuppazee.app">support@cuppazee.app</a> or contact us via Facebook
          at <a href="https://www.facebook.com/cuppazee">https://www.facebook.com/cuppazee</a>.
        </p>
      </div>
    </section>
  );
}
