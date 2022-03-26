import { FastifyInstance } from "fastify";

const loadScriptFunction = `
function loadScript(scriptUrl) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.onload = () => {
      resolve();
    };
    document.head.appendChild(script);
  })
}

function loadScriptSync(scriptUrl) {
  var xhrObj = new XMLHttpRequest();
  xhrObj.open('GET', scriptUrl, false);
  xhrObj.send(null);
  eval.bind(window)(xhrObj.responseText);
}
`;

export default function clan_v2_requirements(fastify: FastifyInstance) {
  fastify.get("/patches", async request => {
    return {
      patchedMunzeeAPIEndpoints: ["clan/v2/requirements", "statzee/player/day"],
      // patchUserscripts_Old: {
      //   munzeeMap20220126: {
      //     title: "Munzee Map Patcher - 26/01/2022",
      //     content: `
      //     $(() => {
      //       if(
      //         ([...document.scripts].some(i => i.src.includes('mapbox')))
      //         || document.body.innerHTML.includes("new mapboxgl.Map")){
      //         let lastSwitch = 0;
      //         function switchToBetterStreets(force) {
      //           if(lastSwitch > Date.now() - 5000 && !force) return;
      //           lastSwitch = Date.now();
      //           if("mapRenderInterval" in window && mapRenderInterval){clearInterval(mapRenderInterval)}
      //           if("showStreets" in window) showStreets=true;
      //           map.setStyle("https://api.maptiler.com/maps/1bc0d4ab-fa5f-48de-825a-c97c1e0a430b/style.json?key=4ZJN6g7ZWa5zimjAWwlv");
      //           if("mapInitCirclesFlag" in window) mapInitCirclesFlag=true;
      //           var newMapElement=$('div .mapboxgl-ctrl-bottom-left').last().removeClass("map-box-chenge-offset");
      //           $(".map-box-checked").removeClass("map-box-checked");
      //           $("#streetView").addClass('map-box-checked')
      //         }
      //         function applyMapOptions() {
      //           map.on("styledataloading", () => {
      //             try {
      //               if(map.getStyle() === STREETS) {
      //                 switchToBetterStreets()
      //               }
      //             } catch {
      //               switchToBetterStreets()
      //             }
      //           });
      //           map.on("error", () => {
      //             try {
      //               if(map.getStyle() === STREETS) {
      //                 switchToBetterStreets()
      //               }
      //             } catch {
      //               switchToBetterStreets()
      //             }
      //           });
      //         }
      //         try {
      //           applyMapOptions();
      //         } catch {
      //           setTimeout(() => applyMapOptions(), 1000)
      //         }
      //         $("#streetView").click(function(e){
      //           setTimeout(() => {
      //             if("mapRenderInterval" in window && mapRenderInterval){clearInterval(mapRenderInterval)}
      //             if("showStreets" in window) showStreets=true;
      //             map.setStyle("https://api.maptiler.com/maps/1bc0d4ab-fa5f-48de-825a-c97c1e0a430b/style.json?key=4ZJN6g7ZWa5zimjAWwlv");
      //             if("mapInitCirclesFlag" in window) mapInitCirclesFlag=true;
      //             var newMapElement=$('div .mapboxgl-ctrl-bottom-left').last().removeClass("map-box-chenge-offset");
      //             $(".map-box-checked").removeClass("map-box-checked");
      //             $("#streetView").addClass('map-box-checked')
      //           },100);
      //         });
      //         const interval = setInterval(() => {
      //           if(map.loaded()) clearInterval(interval);
      //           try {
      //             if(map.getStyle() === STREETS) {
      //               switchToBetterStreets()
      //             }
      //           } catch {
      //             switchToBetterStreets()
      //           }
      //         }, 1000);
      //         setTimeout(() => clearInterval(interval), 10000);
      //       }
      //     });
      //   `,
      //     enabled: true,
      //   },
      // },
      patchUserscripts: {
        munzeeMap20220126: {
          title: "Munzee Map Patcher - 26/01/2022",
          // console.log([...document.scripts].map(i => i.src));

          // let added = false;
          // function tryAdd() {
          //   if(added) return;
          //   if("mapboxgl" in window){
          //     added = true;
          //     class BetterMap extends window.mapboxgl.Map {
          //       setStyle(style) {
          //         if (style.includes("maps/streets/style.json")) {
          //           super.setStyle(
          //             style.replace(
          //               /maps\\/streets\\/style.json\\?key=[^]+/,
          //               "maps/1bc0d4ab-fa5f-48de-825a-c97c1e0a430b/style.json?key=4ZJN6g7ZWa5zimjAWwlv"
          //             )
          //           );
          //         } else {
          //           super.setStyle(style);
          //         }
          //       }
          //     }
          //     console.log("loaded", window.mapboxgl?.Map)
          //     window.mapboxgl.Map = BetterMap;
          //   }
          // }

          // const observer = new MutationObserver(function( mutations ) {
          //   tryAdd();
          //   if(added) observer.disconnect();
          // });

          // setTimeout(() => observer.disconnect(), 10000)

          // tryAdd();

          content: `
          ${loadScriptFunction}
          loadScriptSync("https://cdn.jsdelivr.net/npm/mapbox-gl@0.49.0/dist/mapbox-gl.min.js")
          window.maplibregl ||= new Proxy({}, {
            get: (target, prop) => {
              return window.mapboxgl?.[prop];
            }
          });
          document.addEventListener("DOMContentLoaded", async () => {
            // if(!window.maplibregl.Map) {
            //   await loadScript("https://cdn.jsdelivr.net/npm/mapbox-gl@0.49.0/dist/mapbox-gl.min.js")
            // }
            const originalSetStyle = window.maplibregl.Map.prototype.setStyle;
            window.maplibregl.Map.prototype.setStyle = function(style) {
              if (style.includes("maps/streets/style.json")) {
                originalSetStyle.bind(this)("https://api.maptiler.com/maps/1bc0d4ab-fa5f-48de-825a-c97c1e0a430b/style.json?key=4ZJN6g7ZWa5zimjAWwlv");
              } else {
                originalSetStyle.bind(this)(style);
              }
            }
            $("#streetView").click();
          });
          `,
          enabled: false,
        },
        statzeeWhere28012022: {
          content: `
          const start = () => {
            console.log("statzeeWhere28012022 Loaded")
            setTimeout(() => {
              if(!("map" in window) || window.map === undefined) {
                const scr = [...document.querySelectorAll("script[type]:not([src])")].find(i => i.textContent.includes("//mapboxgl.accessToken"));
                const newScript = document.createElement("script");
                newScript.type = "text/javascript";
                newScript.textContent = scr.textContent.replace("//mapboxgl.accessToken", "window.mapboxgl=window.mapboxgl||{};mapboxgl.accessToken").replace("window.onload = ", "(").replace(/;\\s*$/, ")();");
                console.log(newScript);
                document.body.appendChild(newScript);
              }
            }, 500)
          };
          document.addEventListener("DOMContentLoaded", start);
          if(document.readyState === "complete" 
            || document.readyState === "loaded" 
            || document.readyState === "interactive") start();
`,
          enabled: true,
        },
        // list: {
        //   content: `
        //     document.addEventListener("load", () => {
        //       setTimeout(() => {
        //           document.body.innerHTML += \`<div id="czpatcherpopup" style="position: absolute; top:8px;right:8px;z-index:1000000000;background-color:white; padding:4px;border-radius:4px;box-shadow: 4.0px 8.0px 8.0px hsl(0deg 0% 0% / 0.38);">
        //           <strong>CuppaZee Patcher</strong>
        //           \${Object.entries(window.__cz__patches).map(i => {
        //           if(!i[1].enabled) return "";
        //           if(!i[1].loaded) return \`<div style="color:red;">‣ \${i[1].title || i[0]} [Failed]</div>\`;
        //           return \`<div>‣ \${i[1].title || i[0]}</div>\`;
        //           }).join("")}
        //           <button onclick="$('#czpatcherpopup').remove()">close</button>
        //           </div>\`
        //       },500);
        //     })
        // `,
        //   enabled: false,
        // },
      },
    };
  });
}
