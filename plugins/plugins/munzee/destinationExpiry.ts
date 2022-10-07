import dayjs from "dayjs";
import duration from "dayjs/plugin/duration.js";
import relativeTime from "dayjs/plugin/relativeTime.js";
import localizedFormat from "dayjs/plugin/localizedFormat.js";
import { PluginMeta } from "../../base.js";

dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export const meta: PluginMeta = {
  name: "Bouncer Expiry Times",
  id: "bouncerexpiry",
  urls: ["*www.munzee.com/m/*/*", "*/munzee.com/m/*/*"],
  defaultOn: true,
};

async function getBouncers(munzee_id: number) {
  const response = await fetch(
    `https://server.cuppazee.app/munzee/bouncers?munzee_id=${munzee_id}&from=create`
  );
  return await response.json();
}

export async function afterLoad() {
  const munzeeTypeIcon = document.querySelector<HTMLImageElement>(".pin")?.src;
  if (munzeeTypeIcon?.includes("treehouse") || munzeeTypeIcon?.includes("skyland")) {
    const munzee_id = (window as any).munzee_id as number;
    const bouncers = await getBouncers(munzee_id);
    const bouncerDivs = document.querySelectorAll<HTMLElement>("div.unicorn");
    let index = 0;
    for (const div of Array.from(bouncerDivs)) {
      const bouncer = bouncers.data[index];
      if (bouncer) {
        div.innerHTML = `${
          index === 0
            ? `<a href="https://max.cuppazee.app/munzee/${munzee_id}"><img src="https://server.cuppazee.app/logo.png" style="height:48px;"/></a><br><br>`
            : ""
        }<img style="height: 32px;" src="${bouncer.munzee_logo}">Hosting <a href="${
          bouncer.unicorn_munzee.code
        }">${bouncer.unicorn_munzee.friendly_name}</a> by <a href="/m/${
          bouncer.unicorn_munzee.creator_username
        }">${bouncer.unicorn_munzee.creator_username}</a>! <span title="${dayjs(
          bouncer.good_until * 1000
        ).format()}">Expires in ${dayjs
          .duration(bouncer.good_until * 1000 - Date.now())
          .humanize()} (${dayjs(bouncer.good_until * 1000).format("LTS")})</span>`;
      }
      index++;
    }
  }
}
