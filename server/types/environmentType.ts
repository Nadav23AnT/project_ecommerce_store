export interface environmentType {
  envType: string;
  shualCityId: number;
  lamas: number;
  name: string;
  isTraining: boolean;
  isEnabled: boolean;
  logo: string;
  location: {
    type: string;
    coordinates: [number];
  };
  envUrl: string;
  envUsername: string;
  envPassword: string;
}
