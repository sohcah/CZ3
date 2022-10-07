import { injectStyleSheet, PluginMeta } from "../../base.js";

export const meta: PluginMeta = {
  name: "Design Patches",
  id: "designpatches",
  urls: [
    "*www.munzee.com/*",
    "*/munzee.com/*",
    "*statzee.munzee.com/*",
    "*calendar.munzee.com/*",
    "*www.munzee.com",
    "*/munzee.com",
    "*statzee.munzee.com",
    "*calendar.munzee.com",
  ],

  defaultOn: true,
};

function injectStyles() {
  injectStyleSheet`
      .card .back .description {
        font-size: 14px;
      }

      #credits-page #munzee-holder img {
        width: 60px;
      }

      img[src='https://munzee.global.ssl.fastly.net/images/pins/normal.png'] {
        content: url('https://munzee.global.ssl.fastly.net/images/pins/munzee.png') !important;
      }

      .social-link[href*='reddit.com'] {
        display: none;
      }

      #sub-menu .nav > li > a, #sub-menu .nav > li > a {
        margin-top: -1px;
      }

      .navbar-default .navbar-nav > .open > a, .navbar-default .navbar-nav > .open > a:focus, .navbar-default .navbar-nav > .open > a:hover {
        background-color: #333;
      }
  `;
}

function injectCalendarStyles() {
  injectStyleSheet`
      #banner-carousel {
        padding-top: 0;
      }
      .carousel-inner {
        height: 100%;s
      }
      .carousel-inner .item {
        padding-top: 10em;
      }

      .fc-today-button {
        display: none;
      }
      .fc-month-button {
        border-radius: 4px;
      }
  `;
}

export function beforeLoad() {
  if (location.hostname === "calendar.munzee.com") {
    injectCalendarStyles();
    return;
  }
  injectStyles();
}
