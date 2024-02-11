interface PlantData {
  name: string;
  quantity: number;
  co2Sequestration: number;
}

export interface CampaignData {
  campaignName: string;
  orgName: string;
  orgPhone: string;
  latitude: string;
  longitude: string;
  plantdata: PlantData;
  Totalco2Sequestration: number;
  donorList: string[];
  targetAmount: number;
  collectedAmount: number;
  completed: boolean;
  CarbonCredits: number;
  ngoId: string;
}
