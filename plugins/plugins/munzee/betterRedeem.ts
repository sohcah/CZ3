import { PluginMeta } from "../../base.js";

interface SectionDetails {
  name: string;
  items: Details[];
}

interface Columns {
  row: HTMLTableRowElement;
  type: HTMLTableCellElement;
  notes: HTMLTableCellElement;
  amount: HTMLTableCellElement;
  quantity: HTMLTableCellElement;
  cost: HTMLTableCellElement;
}

interface Details {
  cost: {
    amount: number;
    currentAmount: number;
    name: string;
    icon: string;
  };
  item: {
    amount: number;
    name: string;
    icon: string;
  };
  notes: string;
  columns: Columns;
}

function getIcon(name: string) {
  return `https://images.cuppazee.app/types/64/${encodeURIComponent(
    name
      .toLowerCase()
      .replace(/sham rock/, "shamrockcredit")
      .replace(/\s/g, "")
  )}.png`;
}

export const meta: PluginMeta = {
  name: "Better Redeem",
  id: "betterredeem",
  urls: ["*www.munzee.com/*", "*/munzee.com/*"],

  defaultOn: true,
};

function injectStyles() {
  document.head.innerHTML += `
    <style>
    .section-wrapper {
      display: flex !important;
      align-items: center;
      flex-wrap: wrap;
    }
    
    .section-wrapper > h2 {
      margin: 0px !important;
      flex: 1;
    }
    
    .section-wrapper .countdown {
      margin: 0px !important;
    }

    .section-wrapper table {
      display: flex;
      width: 100%;
    }

    .section-wrapper table thead {
      display: none;
    }

    .section-wrapper table tbody {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
    }

    .section-wrapper table tbody tr {
      min-width: 250px;
      max-width: 100%;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 8px;
      padding: 8px;
      background-color: var(--cz-redeem-card-bg, white);
      border-radius: 8px;
      box-shadow: 0px 10px 15px -3px rgba(0,0,0,0.1);
      flex-basis: 0;
      position: relative;
      overflow: hidden;
    }
    
    .section-wrapper table tbody tr.cz__redeemitem__premium {
      box-shadow: 0px 10px 15px -3px rgba(255,215,0,0.4);
      border: 1px solid rgb(255,215,0);
    }

    .section-wrapper table tbody tr td {
      display: flex;
      flex-direction: column;
      align-items: center;
      border-top: none;
      background: none !important;
      padding: 0;
    }
    
    .section-wrapper table tbody tr td.cz__redeemitem__limit {
      position: absolute;
      top: 0;
      left: 0;
      transform: translateX(-50%) translateY(-50%) rotate(-45deg) translateY(35px);
      background-color: #ff5500 !important;
      padding: 5px 50px;
      color: white;
      font-size: 16px;
      font-weight: bold;
    }

    .section-wrapper table tbody tr td:last-child br {
      display: none;
    }

    .section-wrapper table tbody tr td a.btn {
      text-transform: capitalize;
      margin-left: 0;
      float: none;
    }

    .cz__redeemitem__type {
      flex-direction: row !important;
      justify-content: center;
      font-weight: bold;
      width: 100%;
    }

    .cz__redeemitem__notes {
      align-self: stretch;
      align-items: stretch !important;
      text-align: center;
    }

    .cz__redeemitem__notes:empty {
      display: none;
    }

    .cz__redeemitem__item,
    .cz__redeemitem__cost {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: min(40%, 120px);
    }
    </style>
  `;
}

export function beforeLoad() {
  injectStyles();
}

export async function afterLoad() {
  const toolbar = document.querySelector("body > div.navbar");
  if (toolbar) {
    const storeToolbarItem =
      toolbar.querySelector("[title='Store']") ??
      toolbar.querySelector("[data-original-title='Store']");
    if (storeToolbarItem) {
      storeToolbarItem.outerHTML += `<li class="hidden-xs nav-short tooltip-helper" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Redeem"><a href="https://www.munzee.com/redeem/">
                                  <i class="fa fa-exchange"></i>
                                <span class="visible-xs">Redeem</span></a>
            </li>`;
    }
  }

  if (!location.href.match(/.com\/redeem\/?$/)) return;

  document.querySelector(".container .col-lg-12 > section > ul")?.remove();

  for (const countdownBox of Array.from(document.querySelectorAll("#countdownbox"))) {
    countdownBox.childNodes[0].remove();
  }

  for (const input of Array.from(
    document.querySelectorAll(`.section-wrapper table tbody tr td input[name="quantity"]`)
  )) {
    if (input.attributes.getNamedItem("type")?.value === "hidden") {
      input.parentElement!.style.display = "none";
    }
    input.classList.add("form-control");
    const label = document.createElement("label");
    label.innerText = "Quantity";
    input.parentElement?.insertBefore(label, input);
    input.parentElement?.classList.add("form-group");
  }

  const sections = Array.from(document.querySelectorAll(".section-wrapper"));
  const sectionDetails: SectionDetails[] = [];

  for (const section of sections) {
    const header = section.querySelector("h2");
    const headerRow = section.querySelector("table thead tr");
    const headerColumns = Array.from(headerRow?.querySelectorAll("th") ?? []);
    const columnIndexes = {
      type: headerColumns.findIndex(i => i.innerText.match(/\btype\b/i)),
      notes: headerColumns.findIndex(i => i.innerText.match(/\bnotes\b/i)),
      amount: headerColumns.findIndex(i => i.innerText.match(/\bbundle\b/i)),
      quantity: headerColumns.findIndex(i => i.innerText.match(/\bpurchase\b/i)),
      cost: headerColumns.findIndex(i => i.innerText.match(/\bcost\b/i)),
    };

    const rows = Array.from(section.querySelector("table tbody")?.querySelectorAll("tr") ?? []);
    const itemDetails = [];
    for (const row of rows) {
      const columns = Array.from(row.querySelectorAll("td"));
      const mappedColumns: Columns = {
        row,
        type: columns[columnIndexes.type],
        notes: columns[columnIndexes.notes],
        amount: columns[columnIndexes.amount],
        quantity: columns[columnIndexes.quantity],
        cost: columns[columnIndexes.cost],
      };
      const costButton = mappedColumns.cost?.querySelector<HTMLElement>("a.btn");
      const details: Details = {
        cost: {
          amount: parseInt(costButton?.innerText.match(/^([0-9]+)x?/)?.[1] ?? "1"),
          currentAmount: parseInt(
            mappedColumns.cost.innerText.match(/You have ([0-9]+)/)?.[1] ?? "0"
          ),
          name: costButton?.innerText.replace(/^[0-9]+x?\s*/g, "") ?? "",
          icon: getIcon(costButton?.innerText.replace(/^[0-9]+x?\s*/g, "") ?? ""),
        },
        item: {
          amount: parseInt(mappedColumns.amount.innerText),
          name: mappedColumns.type.innerText,
          icon: mappedColumns.type.querySelector("img")?.src ?? "",
        },
        notes: mappedColumns.notes.innerText.trim(),
        columns: mappedColumns,
      };
      itemDetails.push(details);
    }
    sectionDetails.push({
      name: header?.innerText ?? "",
      items: itemDetails,
    });
  }

  for (const section of sectionDetails) {
    for (const item of section.items) {
      const { row, type, amount, notes } = item.columns;

      // Header
      type.classList.add("cz__redeemitem__type");
      type.innerHTML = "";
      // Cost
      const leftImg = document.createElement("img");
      leftImg.src = item.cost.icon;
      leftImg.style.width = "64px";
      const leftText = document.createElement("div");
      leftText.innerText = `${item.cost.amount}x ${item.cost.name}`;
      const left = document.createElement("div");
      left.appendChild(leftImg);
      left.appendChild(leftText);
      left.classList.add("cz__redeemitem__cost");
      type.appendChild(left);

      // Arrow
      const middle = document.createElement("div");
      middle.classList.add("fa", "fa-arrow-right");
      middle.style.fontSize = "24px";
      middle.style.marginLeft = "8px";
      middle.style.marginRight = "8px";
      type.appendChild(middle);

      // Item
      const rightImg = document.createElement("img");
      rightImg.src = item.item.icon;
      rightImg.style.width = "64px";
      const rightText = document.createElement("div");
      rightText.innerText = `${item.item.amount}x ${item.item.name}`;
      const right = document.createElement("div");
      right.appendChild(rightImg);
      right.appendChild(rightText);
      right.classList.add("cz__redeemitem__item");
      type.appendChild(right);

      amount.style.display = "none";

      notes.classList.add("cz__redeemitem__notes");

      let notesText = notes.innerHTML.trim();
      if (
        section.name.match(/premium/i) ||
        notesText.includes("This option is for Premium Users only.")
      ) {
        row.classList.add("cz__redeemitem__premium");
        // notesText = notesText.replace(/This option is for Premium Users only\. */, "");
      }
      const limitRegex = /-?\s*limit\s*(\d+)/i;
      if (notesText.match(limitRegex)) {
        const limitText = document.createElement("td");
        limitText.innerText = `Max ${notesText.match(limitRegex)?.[1] ?? "???"}`;
        limitText.classList.add("cz__redeemitem__limit");
        row.appendChild(limitText);
        notesText = notesText.replace(limitRegex, "");
      }
      notes.innerHTML = notesText;
    }
  }
}
