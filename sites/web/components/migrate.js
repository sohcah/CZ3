import { useEffect, useState } from "react";

export default function MigrateMaxData() {
  const [l, setL] = useState(false);
  useEffect(() => {
    setL(
      typeof window !== "undefined" &&
        localStorage.CUPPAZEE_TEAKENS &&
        localStorage.migrated !== "2" && window.location.hostname !== "v1.cuppazee.app"
    );
  }, []);
  if (!l) {
    return null;
  }
  return (
    <section
      key="migrate"
      className="bg-black text-white lg:min-h-[200px] flex flex-col lg:flex-row px-4 py-8 lg:px-20 items-center text-center lg:text-left">
      <div className="flex-grow">
        <h1 className="text-3xl font-bold">Migrate CuppaZee Max Data</h1>
        <h2 className="text-lg">
          It looks like you haven't migrated your data from cuppazee.app to max.cuppazee.app.
        </h2>
        <div className="flex flex-row justify-center lg:justify-start">
          <button
            onClick={() => {
              const migrationData = Object.assign({}, localStorage);
              delete migrationData["@czexpress/dbcache"];
              localStorage.migrated = "2";
              location.href =
                "https://max.cuppazee.app/migration.html?t=" +
                Date.now() +
                "#" +
                encodeURIComponent(JSON.stringify(migrationData));
            }}
            className="bg-[#03C35B] text-black p-2 rounded-md">
            Migrate your Data
          </button>
          <button
            onClick={() => {
              if (confirm("Are you sure you want to remove this data?")) {
                localStorage.clear();
                setL(false);
              }
            }}
            className="bg-red-900 text-white ml-2 p-2 rounded-md">
            Remove Data
          </button>
        </div>
      </div>
    </section>
  );
}
