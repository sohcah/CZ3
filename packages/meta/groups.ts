export interface GroupData {
  id: number;
  name: string;
  human_id: string;
  icons: string[];
  seasonal?: GroupSeasonalProperties;
  parents: (number | string)[];
}

export interface GroupSeasonalProperties {
  year: number;
  starts: string;
  ends: string;
}
