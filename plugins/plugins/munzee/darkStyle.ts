import { injectStyleSheet, PluginMeta } from "../../base.js";

export const meta: PluginMeta = {
  name: "Dark Style",
  id: "darkstyle",
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

  defaultOn: false,
};

let highChartsColorStyles = "";

function highChartsColorReplace(colors: string[], newColor: string) {
  for (const style of ["fill", "stroke", "color"]) {
    highChartsColorStyles += `
      
      ${colors
        .map(
          color => `
      :root.dark [data-highcharts-chart] [${style}='${color.toLowerCase()}'],
      :root.dark [data-highcharts-chart] [${style}='${color.toUpperCase()}'],
      :root.dark [data-highcharts-chart] [style*='${style}:${color.toLowerCase()};'],
      :root.dark [data-highcharts-chart] [style*='${style}:${color.toUpperCase()};'],
      :root.dark [data-highcharts-chart] [style*='${style}: ${color.toLowerCase()};'],
      :root.dark [data-highcharts-chart] [style*='${style}: ${color.toUpperCase()};']
      `
        )
        .join(",")} {
        ${style}: ${newColor} !important;
      }
      `;
  }
}

function injectStyles() {
  injectStyleSheet`
      :root.dark {
        --cz-redeem-card-bg: #232323;
        --cz-mapsandbox-off: #ff7777;
        --cz-mapsandbox-on: #77ff77;
        --cz-mapsandbox-captureareas: #77ff77;
        --cz-mapsandbox-scatterareas: #7777ff;
        --cz-mapsandbox-blockedareas: #ff7777;
        color-scheme: dark;
      }
      :root.dark body {
        background-color: #121212;
        color: white;
      }
      :root.dark .panel-default {
        border-color: #232323;
      }
      :root.dark .panel-footer {
        border-top-color: #121212;
        background-color: #232323;
      }
      :root.dark .table > tbody > tr > td,
      :root.dark .table > tbody > tr > th,
      :root.dark .table > tfoot > tr > td,
      :root.dark .table > tfoot > tr > th,
      :root.dark .table > thead > tr > td,
      :root.dark .table > thead > tr > th {
        border-top: 1px solid #232323;
      }
      :root.dark .table-striped>tbody>tr:nth-child(odd)>td,
      :root.dark .table-striped>tbody>tr:nth-child(odd)>th {
        background-color: #232323;
      }
      :root.dark a {
        color: #00C35B;
      }
      :root.dark a:hover {
        color: #cccccc;
      }
      :root.dark #user-details-page .panel-default .stat {
        border: 2px solid #232323;
      }
      :root.dark hr {
        border-top: 1px solid #232323;
      }
      :root.dark .navbar {
        background-color: #232323;
      }
      :root.dark .navbar-default {
        border-bottom-width: 0;
        height: 52px;
        box-shadow: 0 3px 2px rgba(255, 255, 255, .46)
      }
      :root.dark .navbar-default .navbar-nav > li > a,
      :root.dark .navbar-default .navbar-text {
        color: #aaa;
      }
      :root.dark .navbar-default .navbar-nav > li > a:focus,
      :root.dark .navbar-default .navbar-nav > li > a:hover {
        color: #ddd;
      }
      :root.dark .navbar-default .navbar-nav > .active > a,
      :root.dark .navbar-default .navbar-nav > .active > a:focus,
      :root.dark .navbar-default .navbar-nav > .active > a:hover {
        background-color: #00C35B;
        color: black;
      }
      :root.dark .dropdown-menu,
      :root.dark #generic-page .navbar-collapse .user-menu,
      :root.dark #generic-page .navbar-collapse ul {
        background: #333333;
        color: white;
      }
      :root.dark .dropdown-header {
        background-color: #00C35B;
        color: black;
      }
      :root.dark .dropdown-menu > li > a {
        color: #ccc;
      }
      :root.dark .dropdown-menu > li > a:focus,
      :root.dark .dropdown-menu > li > a:hover {
        color: #00C35B;
      }
      :root.dark .user-menu li a:hover {
        color: white;
        background: #016930;
      }
      :root.dark .green,
      :root.dark .user {
        background: #016930;
      }
      :root.dark .green:hover,
      :root.dark .user:hover,
      :root.dark .user:focus,
      :root.dark .navbar-default .navbar-nav > .open > a,
      :root.dark .navbar-default .navbar-nav > .open > a:focus,
      :root.dark .navbar-default .navbar-nav > .open > a:hover {
        background: #00C35B;
        color: black;
      }
      :root.dark [style*="background: crimson"] {
        color: white;
      }
      :root.dark #clan-details,
      :root.dark #munzee-details,
      :root.dark #user-stats,
      :root.dark #download-page .showcase-top,
      :root.dark #Section-4,
      :root.dark #business,
      :root.dark #error,
      :root.dark #events,
      :root.dark #game,
      :root.dark #head-top {
        position: relative;
        background: none !important;
      }
      
      :root.dark #clan-details::before,
      :root.dark #munzee-details::before,
      :root.dark #user-stats::before,
      :root.dark #download-page :root.dark .showcase-top::before,
      :root.dark #Section-4::before,
      :root.dark #business::before,
      :root.dark #error::before,
      :root.dark #events::before,
      :root.dark #game::before,
      :root.dark #head-top::before {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        opacity: 0.2;
        content: "";
        background: #00C35B url("https://server.cuppazee.app/LoginBackground.png");
      }
      :root.dark .stat-green {
        background: #00C35B;
        color: black;
      }
      :root.dark .user-stat a,
      :root.dark .user-stat a:hover,
      :root.dark .user-stat span,
      :root.dark .user-stat span:hover {
        color: black;
      }
      :root.dark #sub-menu {
        background: #016930;
        border-color: #016930;
      }
      :root.dark .clan a,
      :root.dark .clan h2 small,
      :root.dark #munzee-details .deployed a {
        color: #ccc;
      }
      :root.dark .card {
        background: #232323;
      }
      :root.dark #types-page .alterna,
      :root.dark #types-page .teammate .description span {
        color: #ccc;
      }
      :root.dark #types-page .teammate .card.rotate:hover,
      :root.dark #team-page .teammate .card:hover {
        background-color: #016930;
      }
      :root.dark #sidebar .nav li a {
        color: #ccc;
      }
      :root.dark #sidebar .nav li a:hover {
        color: #00C35B;
      }
      :root.dark #sidebar .nav li:hover {
        border-left-color: #00C35B;
      }
      :root.dark .active,
      :root.dark .collapsible:hover {
        background-color: #00C35B;
      }
      :root.dark #sidebar .nav li.active:hover {
        background-color: #016930;
      }
      :root.dark #sidebar .nav li.active a {
        color: black;
      }
      :root.dark #sidebar .nav li.active a:hover {
        color: white;
      }
      :root.dark .btn-success:not(.dark) {
        border-color: #016930;
      }
      :root.dark .btn-success:hover.dark {
        border-color: transparent;
      }
      :root.dark .showcase-lighter-green {
        background-color: #232323;
      }
      :root.dark .how i {
        color: #00C35B;
      }
      :root.dark .captures {
        background-color: #016930;
      }
      :root.dark .deployments {
        background-color: #00C35B;
      }
      :root.dark #footer ul.nav li a.social-link {
        color: #00C35B;
      }
      :root.dark #testimonials-page .testimonial-box {
        background-color: #232323;
        color: white;
      }
      :root.dark blockquote {
        color: white;
      }
      :root.dark .world-rank span.badge {
        background-color: white;
        color: black;
      }
      :root.dark .badge-success,
      :root.dark .title-badge {
        background-color: #00C35B;
        color: black;
      }
      :root.dark #clan-details,
      :root.dark #munzee-details,
      :root.dark #user-stats {
        margin-top: 54px;
      }
      :root.dark #munzee-holder section .stat,
      :root.dark #room-holder section .stat {
        background-color: #00C35B;
        color: black;
      }
      :root.dark .form-control {
        background-color: #333333;
        color: white;
        border: 1px solid #232323;
      }
      :root.dark .pager li > a,
      :root.dark .pager li > span,
      :root.dark .pager .disabled > a,
      :root.dark .pager .disabled > a:focus,
      :root.dark .pager .disabled > a:hover,
      :root.dark .pager .disabled > span {
        background-color: #00C35B;
        color: black;
      }
      :root.dark .pager li > a:focus,
      :root.dark .pager li > a:hover {
        background-color: #016930;
        color: white;
      }
      :root.dark .pager .disabled > a,
      :root.dark .pager .disabled > a:focus,
      :root.dark .pager .disabled > a:hover,
      :root.dark .pager .disabled > span {
        opacity: 0.6;
      }
      :root.dark #munzee-holder section .wrote-at,
      :root.dark #room-holder section .wrote-at {
        background-color: #016930;
      }
      :root.dark .popover {
        background-color: #333333;
      }
      :root.dark .popover-title {
        background-color: #232323;
      }
      :root.dark .panel-heading {
        background-color: #016930;
      }
      :root.dark #user-gallery-page .munzee-photo-small.active-photo {
        border-color: #00C35B;
      }
      :root.dark #munzee-holder .table tbody td:nth-of-type(4),
      :root.dark #munzee-holder .table tbody td:nth-of-type(6),
      :root.dark #blasts-page #munzee-holder .table tbody td:nth-of-type(1) {
        background-color: #333333;
      }
      :root.dark #munzee-holder .table tbody td,
      :root.dark #blasts-page #munzee-holder .table tbody td,
      :root.dark #munzee-holder .table tbody td:nth-of-type(5),
      :root.dark #munzee-holder .table tbody td:nth-of-type(7) {
        background-color: #232323;
      }

      :root.dark .alert-info {
        background-color: #31708f77;
        color: #d9edf7;
        border-color: #31708f;
      }
      :root.dark .alert-danger {
        background-color: #a9444277;
        color: #f2dede;
        border-color: #a94442;
      }
      :root.dark .alert-warning {
        background-color: #8a6d3b77;
        color: #fcf8e3;
        border-color: #8a6d3b;
      }
      :root.dark .alert-success {
        background-color: #3c763d77;
        color: #dff0d8;
        border-color: #3c763d;
      }
      :root.dark #flow-page .subtext {
        color: #ccc;
      }

      :root.dark #flow-page a[style*='color: #333;'] {
        color: #ccc !important;
      }

      :root.dark #loyaltylion .lion-history-table {
        background-color: #232323;
        color: white;
        border: 0px;
      }
      :root.dark #loyaltylion .lion-history-table__header-cell {
        background-color: #333333;
        color: white;
      }
      :root.dark #loyaltylion .lion-history-table__row {
        background-color: #232323;
      }
      :root.dark #loyaltylion .lion-history-table__row:nth-child(2n) {
        background-color: #121212;
      }
      :root.dark #loyaltylion .lion-history-state-bubble--approved {
        background-color: #03543f;
        color: #def7ec;
      }

      :root.dark .pinpoints-container table td,
      :root.dark .pinpoints-container table th {
        border: 1px solid #333333;
      }
      
      :root.dark #leaderboard-split-page .rank,
      :root.dark #leaderboard-split-page .leaderboard-captures,
      :root.dark #leaderboard-split-page .points {
        background-color: #333333;
        color: white;
      }

      :root.dark #stats-generic-page .global-stat h3 {
        color: #ccc;
      }
      :root.dark #stats-generic-page .global-stat h3 span {
        color: #00C35B;
      }

      :root.dark #credits-page table {
        background-color: #333;
      }

      :root.dark .mapboxgl-popup-content {
        background-color: #232323;
      }

      :root.dark #openquickdeploymodal {
        background-color: #004400 !important;
      }
      :root.dark #removeFromSB {
        background-color: #440000 !important;
      }
      :root.dark #removeFromSB:hover,
      :root.dark #openquickdeploymodal:hover {
        color: #fff !important;
      }

      :root.dark .modal-content {
        background-color: #232323;
      }
      :root.dark .modal-header {
        border-bottom: 1px solid #333;
      }
      :root.dark .modal-footer {
        border-top: 1px solid #333;
      }

      :root.dark .content {
        background-color: #232323;
      }

      :root.dark a:focus,
      :root.dark a:hover {
        color: #00C35B;
      }

      :root.dark #retail-page .showcase .fa {
        color: #00C35B;
      }

      :root.dark .nav>li>a:focus,
      :root.dark .nav>li>a:hover {
        background-color: #232323;
      }

      :root.dark .well {
        background-color: #232323;
        border: 1px solid #333;
      }

      :root.dark .well span,
      :root.dark .well p {
        background-color: #232323 !important;
        color: white !important;
      }

      :root.dark .well a {
        background-color: #232323 !important;
        color: #00C35B !important;
      }

      :root.dark #referral-page #qrcode img {
        filter: invert(1);
      }

      :root.dark .input-group-addon {
        background-color: #444;
        color: #00C35B;
        border: 1px solid #232323;
      }

      :root.dark #rover-details-page .panel,
      :root.dark #rover-entries-page .panel {
        border-color: #00C35B;
      }

      :root.dark #rover-details-page .panel-heading,
      :root.dark #rover-entries-page .panel-heading {
        background-color: #00C35B;
      }

      :root.dark #rover-details-page .table tr:nth-child(2n),
      :root.dark #rover-entries-page .table tr:nth-child(2n) {
        background-color: #121212;
      }

      :root.dark #rover-details-page .table td:nth-child(3) a,
      :root.dark #rover-entries-page .table td:nth-child(3) a {
        color: white;
      }
      :root.dark #rover-edit-page #sub-menu ul.dropdown-menu {
        background: #333333;
      }

      :root.dark .table-hover > tbody > tr:hover > td,
      :root.dark .table-hover > tbody > tr:hover > th {
        background-color: #232323;
      }

      :root.dark .jvectormap-container {
        background-color: #232323 !important;
      }

      :root.dark .jvectormap-container svg {
        filter: invert(1) hue-rotate(180deg) brightness(2);
      }

      :root.dark #stats-playerstats-page #stats-table tbody tr:nth-child(2n) {
        background-color: #232323;
      }

      :root.dark #stats-playerstats-page #stats-table tbody .hl {
        color: #777777;
      }

      :root.dark .table-bordered,
      :root.dark .table-bordered > tbody > tr > td,
      :root.dark .table-bordered > tbody > tr > th,
      :root.dark .table-bordered > tfoot > tr > td,
      :root.dark .table-bordered > tfoot > tr > th,
      :root.dark .table-bordered > thead > tr > td,
      :root.dark .table-bordered > thead > tr > th {
        border: 1px solid #232323;
      }

      /* StatZee Player Grid Steps */

      :root.dark #stats-playergrid-page #stats-day-table a {
        color: white;
      }

      :root.dark #stats-playergrid-page #stats-day-table .step1 {
        background-color: #55aa5522;
      }

      :root.dark #stats-playergrid-page #stats-day-table .step2 {
        background-color: #55aa5533;
      }

      :root.dark #stats-playergrid-page #stats-day-table .step3 {
        background-color: #55aa5544;
      }

      :root.dark #stats-playergrid-page #stats-day-table .step4 {
        background-color: #55ff5544;
      }

      :root.dark #stats-playergrid-page #stats-day-table .step5 {
        background-color: #77ff0044;
      }

      :root.dark #stats-playergrid-page #stats-day-table .step6,
      :root.dark #stats-playergrid-page #stats-day-table .step7,
      :root.dark #stats-playergrid-page #stats-day-table .step8,
      :root.dark #stats-playergrid-page #stats-day-table .step9 {
        background-color: #77aa0044;
      }

      :root.dark #stats-playergrid-page #stats-day-table .step10,
      :root.dark #stats-playergrid-page #stats-day-table .step11,
      :root.dark #stats-playergrid-page #stats-day-table .step12,
      :root.dark #stats-playergrid-page #stats-day-table .step13 {
        background-color: #ff770044;
      }

      :root.dark #stats-playergrid-page #stats-day-table .step14,
      :root.dark #stats-playergrid-page #stats-day-table .step15,
      :root.dark #stats-playergrid-page #stats-day-table .step16,
      :root.dark #stats-playergrid-page #stats-day-table .step17,
      :root.dark #stats-playergrid-page #stats-day-table .step18,
      :root.dark #stats-playergrid-page #stats-day-table .step19,
      :root.dark #stats-playergrid-page #stats-day-table .step20 {
        background-color: #ff000044;
      }

      :root.dark #stats-playerrankings-page tr.own-row {
        background-color: #00C35B77;
      }

      :root.dark #stats-playerrankings-page tr.own-row:hover td,
      :root.dark #stats-playerrankings-page tr.own-row:focus td {
        background-color: #00C35B88;
      }

      :root.dark #stats-playerrankings-page tr.own-row a {
        color: white;
      }

      :root.dark #stats-playersocials-page span.number {
        color: #aaaaaa;
      }

      :root.dark #stats-playersocials-page img.simage:hover {
        background-color: #232323;
        border-color: #232323;
      }

      :root.dark #stats-playerleaderboard-page tr:nth-child(2n) {
        background-color: #232323;
      }

      :root.dark #stats-playeralternamyths-page table td,
      :root.dark #stats-playeralternamyths-page table th,
      :root.dark #stats-playergardengnomes-page table td,
      :root.dark #stats-playergardengnomes-page table th,
      :root.dark #stats-playerunicorns-page table td,
      :root.dark #stats-playerunicorns-page table th {
        border: 1px solid #232323;
      }

      :root.dark img[src='https://munzee.global.ssl.fastly.net/images/site/404-not-found.jpg'] {
        filter: invert(1) hue-rotate(180deg);
      }
      
      :root.dark .mapboxgl-ctrl-geocoder,
      :root.dark .mapboxgl-ctrl-group {
        filter: invert(1) hue-rotate(180deg);
      }
      
      :root.dark .container {
        position: relative;
      }
      
      :root.dark #foot-sec {
        background-color: #232323;
      }
      
      :root.dark #game.showcase-lighter-green {
        background-color: #333333 !important;
      }
      
      ${highChartsColorStyles}
  `;
}

function injectCalendarStyles() {
  injectStyleSheet`
      :root.dark {
        color-scheme: dark;
      }

      :root.dark body {
        background-color: #121212;
        color: white;
      }

      :root.dark nav.navbar-default {
        background-color: #232323;
        color: white;
        border-radius: 0;
      }
      :root.dark .navbar-default .navbar-nav > li > a,
      :root.dark .navbar-default .navbar-text {
        color: #fff;
      }
      :root.dark .navbar-default .navbar-nav > li > a:focus,
      :root.dark .navbar-default .navbar-nav > li > a:hover {
        color: #00C35B;
      }
      :root.dark #navbar_ul li a.active::after {
        background-color: #00C35B;
      }
      :root.dark #submit-btn:hover {
        background-color: #00C35B;
        color: black;
      }
      :root.dark .navbar-default .navbar-nav > .open > a,
      :root.dark .navbar-default .navbar-nav > .open > a:focus,
      :root.dark .navbar-default .navbar-nav > .open > a:hover {
        background-color: #00C35B;
        color: black;
      }

      :root.dark .dropdown-menu {
        background-color: #333333;
        color: white;
      }
      :root.dark .dropdown-menu > li > a {
        color: white;
      }
      :root.dark .user-menu li a:hover {
        background-color: #00C35B;
        color: black;
      }

      :root.dark body .fc {
        background-color: #232323;
      }
      
      :root.dark .fc-state-default {
        background-color: #333;
        background-image: none;
        color: white;
        text-shadow: none;
        border-color: #121212;
        box-shadow: none;
        border-radius: 4px;
      }

      :root.dark .fc-unthemed .fc-today {
        background-color: #00C35B22;
        opacity: 1;
      }

      :root.dark .fc-unthemed .fc-divider,
      :root.dark .fc-unthemed .fc-popover,
      :root.dark .fc-unthemed .fc-row,
      :root.dark .fc-unthemed tbody,
      :root.dark .fc-unthemed td,
      :root.dark .fc-unthemed th,
      :root.dark .fc-unthemed thead {
        border-color: #333333;
      }

      :root.dark .popover {
        background-color: #232323;
      }
      :root.dark .popover-title {
        background-color: #00C35B;
        border-bottom: 1px solid #121212;
        color: black;
      }

      :root.dark .panel {
        border-color: #121212;
        background-color: #232323;
      }
      :root.dark .footer-text {
        color: white;
      }
      :root.dark .footer-text a {
        color: #00C35B;
      }

      :root.dark hr {
        border-color: #121212;
      }

      :root.dark .popover.top > .arrow::after {
        border-top-color: #232323;
      }

      :root.dark .event-indicator {
        color: white;
      }
      :root.dark .event-indicator:hover,
      :root.dark .event-indicator:focus {
        color: #00C35B;
      }
      :root.dark a[style*='color: black;'] {
        color: white !important;
      }
      :root.dark a[style*='color: black;']:hover,
      :root.dark a[style*='color: black;']:focus {
        color: #00C35B !important;
      }


      :root.dark a.creator_username,
      :root.dark #event-notes a,
      :root.dark .attendants a {
        color: #00C35B;
      }

      :root.dark .help-text a,
      :root.dark .help-title {
        color: #00C35B;
      }

      :root.dark .table-striped > tbody > tr:nth-of-type(2n+1) {
        background-color: #121212;
      }
      :root.dark #pricing-container thead {
        background-color: #00C35B;
        color: black;
      }
      :root.dark .table > thead > tr > th {
        font-weight: normal;
        border-color: #121212;
      }

      :root.dark .form-control {
        background-color: #333333;
        color: white;
        border: 1px solid #232323;
      }
      :root.dark .form-control[disabled],
      :root.dark .form-control[readonly],
      :root.dark fieldset[disabled] .form-control {
        background-color: #232323;
        color: #aaaaaa;
        border-color: #121212;
      }

      :root.dark .picker__box,
      :root.dark .picker--time .picker__box {
        background-color: #333333;
        color: white;
      }
      :root.dark .picker__list-item {
        background-color: #333333;
        color: white;
      }
      :root.dark .picker__list-item:hover,
      :root.dark .picker__list-item:focus,
      :root.dark .picker--focused .picker__list-item--highlighted,
      :root.dark .picker__list-item--highlighted:hover{
        background-color: #00C35B;
        color: black;
      }
      :root.dark .picker--focused .picker__day--disabled,
      :root.dark .picker__day--disabled,
      :root.dark .picker__day--disabled:hover {
        background-color: #232323;
        border-color: #232323;
        color: #aaaaaa;
      }
      :root.dark .picker__nav--next,
      :root.dark .picker__nav--prev {
        filter: invert(1);
      }
      :root.dark .picker__button--today[disabled],
      :root.dark .picker__button--today[disabled]:hover {
        background-color: #232323;
        border-color: #232323;
        color: #aaaaaa;
      }
      :root.dark .picker__button--clear,
      :root.dark .picker__button--close,
      :root.dark .picker__button--today {
        background-color: #232323;
        border-color: #232323;
        color: white;
      }

  `;
}

export function beforeLoad() {
  if (location.hostname === "calendar.munzee.com") {
    injectCalendarStyles();

    if (localStorage.CUPPAZEE_DARK) {
      document.head.parentElement!.classList.add("dark");
    }
    return;
  }
  highChartsColorReplace(["white", "#fff", "#ffffff", "#F8F8F8"], "#232323");
  highChartsColorReplace(["black", "#000", "#000000"], "#00C35B");
  highChartsColorReplace(["#333", "#333333"], "#cccccc");
  highChartsColorReplace(["#444", "#444444"], "#aaaaaa");
  highChartsColorReplace(["rgba(247,247,247,0.85)"], "#333333");
  highChartsColorReplace(["#e6e6e6"], "#121212");
  highChartsColorReplace(["#ccd6eb"], "#333333");

  injectStyles();

  if (localStorage.CUPPAZEE_DARK) {
    document.head.parentElement!.classList.add("dark");
  }
}
