export interface PluginMeta {
  name: string;
  id: string;
  urls: string[];
  credit?: string;
  category?: string;
  defaultOn: boolean;
}

export function injectStyleSheet(strings: TemplateStringsArray, ...args: string[]) {
  let styleContent = "";
  strings.forEach((string, i) => {
    styleContent += string + (args[i] || "");
  });
  const style = document.createElement("style");
  style.textContent = styleContent;
  document.head.appendChild(style);
}
