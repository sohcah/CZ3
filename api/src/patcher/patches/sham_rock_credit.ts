import { Patcher } from "..";
import produce from "immer";

export const shamRockCreditPatcher: Patcher = {
  name: "Sham Rock Credits",
  description: "Renames sham_rock to shamrockcredit for CuppaZee's Icon Server",

  patchIcon(value: string) {
    if (value.match(/\bSham_Rocks?\b/i)) {
      return value.replace(/sham_rock/, "shamrockcredit");
    }
    return value;
  },

  patchName(value: string) {
    if (value.match(/\bSham Rocks?\b/i)) {
      return value.replace(/\bSham Rock(s)?\b(?!\s*n'?\srolla*)/i, "Sham Rock Credit$1");
    }
    return value;
  },

  patchEndpoints: {
    "user/credits/history": data => {
      return produce(data, draft => {
        for (const item of draft.data?.items ?? []) {
          if (item.type.match(/\bSham Rocks?\b/i)) {
            item.type = item.type.replace(/\bSham Rock(s)?\b(?!\s*n'?\srolla*)/i, "Sham Rock Credit$1");
          }
          if (item.log_text.match(/\bSham Rocks?\b/i)) {
            item.log_text = item.log_text.replace(
              /\bSham Rock(s)?\b(?!\s*n'?\srolla*)/i,
              "Sham Rock Credit$1"
            );
          }
        }
      });
    },
  },
};
