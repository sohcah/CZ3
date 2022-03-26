import { FastifyInstance } from "fastify";
import { authenticateAnonymous } from "../../utils/auth";
import { munzeeFetch } from "../../utils/munzee";

import ExcelJS from "exceljs";
import { dbCache } from "../../utils/meta";

export default function DataExportMissingTypes(fastify: FastifyInstance) {
  fastify.get<{
    Params: { game_id?: string; month?: string; year?: string };
  }>("/export/types/missing", async (_, reply) => {
    const token = await authenticateAnonymous();

    const response = await munzeeFetch<any>({
      endpoint: "statzee/global/captures/types",
      params: {},
      token,
    });
    const { data } = await response.getMunzeeData();

    const workbook = new ExcelJS.Workbook();

    const all = workbook.addWorksheet(`All`);

    all.columns = [
      { header: "Number", key: "number", width: 10 },
      { header: "Icon", key: "icon", width: 20 },
      { header: "Name", key: "name", width: 30 },
      { header: "Munzee ID", key: "munzee_id", width: 10 },
      { header: "Logo", key: "logo", width: 10 },
    ];
    const missingIds = workbook.addWorksheet(`Missing IDs`);

    missingIds.columns = [
      { header: "Number", key: "number", width: 10 },
      { header: "Icon", key: "icon", width: 40 },
      { header: "Name", key: "name", width: 40 },
      { header: "Munzee ID", key: "munzee_id", width: 10 },
      { header: "Logo", key: "logo", width: 10 },
    ];
    const missing = workbook.addWorksheet(`Missing`);

    missing.columns = [
      { header: "Number", key: "number", width: 10 },
      { header: "Icon", key: "icon", width: 40 },
      { header: "Name", key: "name", width: 40 },
      { header: "Munzee ID", key: "munzee_id", width: 10 },
      { header: "Logo", key: "logo", width: 10 },
    ];

    const items = [...data];
    items.sort((a, b) => Number(a.capture_type_id) - Number(b.capture_type_id));

    for (const item of items) {
      all.addRow({
        number: Number(item.number),
        munzee_id: item.capture_type_id.toString().padStart(4, "0"),
        name: item.name,
        icon: item.logo.slice(49, -4),
      });
      all.getRow(all.rowCount).height = 50;
      all.getCell(`E${all.rowCount}`).value = {
        formula: `IMAGE("${encodeURI(item.logo.replace(/"/g, '""'))}")`,
        sharedFormula: `IMAGE("${encodeURI(item.logo.replace(/"/g, '""'))}")`,
        date1904: false,
      };
      if (!dbCache.value.getType(item.logo)) {
        missing.addRow({
          number: Number(item.number),
          munzee_id: item.capture_type_id.toString().padStart(4, "0"),
          name: item.name,
          icon: item.logo.slice(49, -4),
        });
        missing.getRow(missing.rowCount).height = 50;
        missing.getCell(`E${missing.rowCount}`).value = {
          formula: `IMAGE("${encodeURI(item.logo.replace(/"/g, '""'))}")`,
          sharedFormula: `IMAGE("${encodeURI(item.logo.replace(/"/g, '""'))}")`,
          date1904: false,
        };

        all.getRow(all.rowCount).eachCell(
          c =>
            (c.style.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "ffffaaaa" },
            })
        );
      } else if (Number(dbCache.value.getType(item.logo)?.munzee_id) !== Number(item.capture_type_id)) {
        missingIds.addRow({
          number: Number(item.number),
          munzee_id: item.capture_type_id.toString().padStart(4, "0"),
          name: item.name,
          icon: item.logo.slice(49, -4),
        });
        missingIds.getRow(missingIds.rowCount).height = 50;
        missingIds.getCell(`E${missingIds.rowCount}`).value = {
          formula: `IMAGE("${encodeURI(item.logo.replace(/"/g, '""'))}")`,
          sharedFormula: `IMAGE("${encodeURI(item.logo.replace(/"/g, '""'))}")`,
          date1904: false,
        };

        all.getRow(all.rowCount).eachCell(
          c =>
            (c.style.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "ffffffaa" },
            })
        );
      }
    }

    reply
      .type("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
      .send(await workbook.xlsx.writeBuffer());
  });
}
