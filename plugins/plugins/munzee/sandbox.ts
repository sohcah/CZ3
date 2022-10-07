import { PluginMeta } from "../../base";

export const meta: PluginMeta = {
  name: "Better Map Sandbox",
  id: "mapsandbox",
  urls: ["*.munzee.com/map*"],
  defaultOn: true,
};

function setupSandbox() {
  const { $ } = window as any;
  $('[id*="SB"]').removeClass("hidden-xs");
  $("#showSBbuttons").click(function () {
    setTimeout(function () {
      $('[id*="SB"]').removeClass("hidden-xs");
      const { mapSandbox, map, onCameraChanged, maplibregl, circle, quick_deploy } = window as any;
      mapSandbox.createItemElement = function (item: any) {
        const imageurl = "https://i.ibb.co/3RKyg0m/Grey-Single-Surprise.png";
        // var fn = htmlrep(username);

        const el = document.createElement("div");
        el.className = "marker map-box-sb-marker";
        el.style.width = `32px`;
        el.style.height = `32px`;
        el.style.cursor = "pointer";
        el.style.setProperty("background-size", "32px 32px", "important");
        el.style.zIndex = "10000000";
        el.style.backgroundImage = "url(" + imageurl + ")";
        el.addEventListener(
          "click",
          function (this: any, e: any) {
            e.stopPropagation();
            this.showItemPopup(item);
          }.bind(this)
        );
        el.click();
        // var bbtn = $("button.mapboxgl-popup-close-button").click();
        return el;
      };
      mapSandbox.circles.basicScatter = { radius: 762, color: "#72ea5d" };
      mapSandbox.circles.catapultScatter = { radius: 402.336, color: "#b56000" };
      mapSandbox.circles.bowlingScatter = { radius: 228.6, color: "#00b52d" };
      mapSandbox.circles.joystickScatter = { radius: 457.2, color: "#b50087" };
      mapSandbox.circles.joystickSecondScatter = { radius: 213.36, color: "#8800b5" };
      mapSandbox.circles.capturePOI = { radius: 304.8, color: "#ff5500" };
      mapSandbox.circles.cardArea = { radius: 152.4, color: "#f54446" };
      mapSandbox.showItemPopup = function (item: any) {
        map.panTo(item.coordinates);
        onCameraChanged();
        this.removePopup();
        this.selectedId = item.id;

        this.itemPopup = new maplibregl.Popup({
          closeButton: false,
          offset: 10,
          anchor: window.innerWidth > 500 ? "left" : "top",
          maxWidth: 400,
        });

        let itemContent = "<section id='createNewItem' style='text-align:center;'>";
        itemContent +=
          "<input class=\"form-control\" style='margin-bottom: 5px;' id='popup_title' type='text' value='" +
          item.title +
          "'>";
        //itemContent += '<input  class="hidden-xs" style=\'margin-left: 10px;\' id=\'saveSBtitle\' type=\'button\' value=\'Save Title\'>';
        itemContent +=
          "<input style='margin-right: 10px;background-color:#aaffaa;' class='btn btn-md' id='openquickdeploymodal' type='button' value='Deploy' data-toggle=\"modal\" data-target=\"#quickdeploy_modal\">";
        itemContent +=
          "<input  class=\"btn btn-md\" style='background-color:#ffaaaa;' id='removeFromSB' type='button' value='Remove'>";
        itemContent += "<span><br />" + item.coordinates[1] + " " + item.coordinates[0] + "</span>";

        if (item.myOwn) {
          itemContent +=
            "<br />Own Munzee:<input style='margin-top: 5px; margin-left:10px;' type='checkbox' checked='checked' id='check_SB_own'/>";
        } else {
          itemContent +=
            "<br />Own Munzee:<input style='margin-top: 5px; margin-left:10px;' type='checkbox' id='check_SB_own'/>";
        }
        const captureAreas = [
          "virtual|captureArea|Virtual",
          "poi_filter|capturePOI|POI",
          "blast_capture|blastArea|Blast",
          "envelope|cardArea|Card",
        ]
          .map(function (i) {
            return `<div style="display:inline-block;padding:4px;" id="newcheck_${
              i.split("|")[1]
            }"><img id="newcheckimg_${i.split("|")[1]}" style="height:36px;width:36px;filter:grayscale(1) opacity(0.4)" src="https://munzee.global.ssl.fastly.net/images/pins/${i.split("|")[0]}.png" /><br/><span style="color:var(--cz-mapsandbox-off, red)" id="newchecktext_${i.split("|")[1]}">${i.split("|")[2]}</span></div>`;
          })
          .join("");

        if (window.innerWidth > 500)
          itemContent += `<br /><div style="text-align:center;max-width:300px;"><div style="font-size:1.5em;font-weight:bold;color:var(--cz-mapsandbox-captureareas, green);">Capture Areas</div>${captureAreas}</div>`;

        const blockAreas = [
          "motel|motelArea|Motel/Trail",
          "hotel|hotelArea|Hotel",
          "virtualresort|resortArea|Resort",
          "timeshare|tsArea|Timeshare",
          "vacationcondo|condoArea|Condo",
          "treehouse|treehouseArea|Treehouse",
          "airmystery|airArea|Air Mystery",
          "sirprizewheel|spwArea|Sir Prize Wheel",
        ]
          .map(function (i) {
            return `<div style="display:inline-block;padding:4px;" id="newcheck_${
              i.split("|")[1]
            }"><img id="newcheckimg_${i.split("|")[1]}" style="height:36px;width:36px;filter:grayscale(1) opacity(0.4)" src="https://munzee.global.ssl.fastly.net/images/pins/${i.split("|")[0]}.png" /><br/><span style="color:var(--cz-mapsandbox-off, red)" id="newchecktext_${i.split("|")[1]}">${i.split("|")[2]}</span></div>`;
          })
          .join("");
        if (window.innerWidth > 500)
          itemContent += `<div style="text-align:center;max-width:300px;"><div style="font-size:1.5em;font-weight:bold;color:var(--cz-mapsandbox-blockedareas, red);">Blocked Areas</div>${blockAreas}</div>`;

        const scatterAreas = [
          "scatter|basicScatter|Default",
          "catapult|catapultScatter|Catapult",
          "bowlingball|bowlingScatter|Bowling",
          "joystickfull|joystickScatter|Joystick",
          "joystickfull|joystickSecondScatter|Joystick #2",
        ]
          .map(function (i) {
            return `<div style="display:inline-block;padding:4px;" id="newcheck_${
              i.split("|")[1]
            }"><img id="newcheckimg_${i.split("|")[1]}" style="height:36px;width:36px;filter:grayscale(1) opacity(0.4)" src="https://munzee.global.ssl.fastly.net/images/pins/${i.split("|")[0]}.png" /><br/><span style="color:var(--cz-mapsandbox-off, red)" id="newchecktext_${i.split("|")[1]}">${i.split("|")[2]}</span></div>`;
          })
          .join("");
        if (window.innerWidth > 500)
          itemContent += `<div style="text-align:center;max-width:300px;"><div style="font-size:1.5em;font-weight:bold;color:var(--cz-mapsandbox-scatterareas, blue);">Scatter Areas</div>${scatterAreas}</div>`;
        itemContent += "</section>";
        this.itemPopup.setLngLat(item.coordinates).setHTML(itemContent).addTo(map);

        for (const layer in mapSandbox.list[mapSandbox.selectedId].layers) {
          if (mapSandbox.list[mapSandbox.selectedId].layers[layer]) {
            $("#newcheckimg_" + layer).css("filter", "none");
            $("#newchecktext_" + layer).css("color", "var(--cz-mapsandbox-on, green)");
          }
        }

        $("#check_SB_own").change(function (this: any) {
          if (!this.checked) {
            mapSandbox.list[mapSandbox.selectedId].myOwn = 0;
            if (mapSandbox.list[mapSandbox.selectedId].layers.ownArea) {
              mapSandbox.removeLayer(mapSandbox.selectedId, "ownArea");
            }
          } else {
            mapSandbox.list[mapSandbox.selectedId].myOwn = 1;
            if (circle) {
              mapSandbox.drawCircle(mapSandbox.selectedId, "ownArea");
            }
          }
        });

        function generate(layer: any) {
          return function () {
            if (!mapSandbox.list[mapSandbox.selectedId].layers[layer]) {
              mapSandbox.drawCircle(mapSandbox.selectedId, layer);
              $("#newcheckimg_" + layer).css("filter", "none");
              $("#newchecktext_" + layer).css("color", "var(--cz-mapsandbox-on, green)");
            } else {
              mapSandbox.removeLayer(mapSandbox.selectedId, layer);
              $("#newcheckimg_" + layer).css("filter", "grayscale(1) opacity(0.4)");
              $("#newchecktext_" + layer).css("color", "var(--cz-mapsandbox-on, red)");
            }
          };
        }

        $("#newcheck_captureArea").click(generate("captureArea"));
        $("#newcheck_capturePOI").click(generate("capturePOI"));
        $("#newcheck_blastArea").click(generate("blastArea"));
        $("#newcheck_cardArea").click(generate("cardArea"));

        $("#newcheck_motelArea").click(generate("motelArea"));
        $("#newcheck_hotelArea").click(generate("hotelArea"));
        $("#newcheck_resortArea").click(generate("resortArea"));
        $("#newcheck_tsArea").click(generate("tsArea"));
        $("#newcheck_condoArea").click(generate("condoArea"));
        $("#newcheck_treehouseArea").click(generate("treehouseArea"));
        $("#newcheck_airArea").click(generate("airArea"));
        $("#newcheck_spwArea").click(generate("spwArea"));

        $("#newcheck_basicScatter").click(generate("basicScatter"));
        $("#newcheck_catapultScatter").click(generate("catapultScatter"));
        $("#newcheck_bowlingScatter").click(generate("bowlingScatter"));
        $("#newcheck_joystickScatter").click(generate("joystickScatter"));
        $("#newcheck_joystickSecondScatter").click(generate("joystickSecondScatter"));

        $("#popup_title").change(
          function (this: any) {
            this.list[this.selectedId].title = $("#popup_title").val();
          }.bind(this)
        );

        $("#removeFromSB").click(
          function (this: any) {
            this.removeSelected();
          }.bind(this)
        );
        $("#openquickdeploymodal")
          .off()
          .click(() => {
            this.list[this.selectedId].title = $("#popup_title").val();
            $("#quickdeployoptions").show();
            $("#quickdeploybody").empty();
          });

        $(".qd-type")
          .off()
          .click(function (this: any) {
            quick_deploy(
              mapSandbox.list[mapSandbox.selectedId].marker.getLngLat().lat,
              mapSandbox.list[mapSandbox.selectedId].marker.getLngLat().lng,
              $(this).data("typeid"),
              mapSandbox.list[mapSandbox.selectedId].title
            );
          });
      };
    }, 250);
  });
}

export function afterLoad() {
  setupSandbox();
}
