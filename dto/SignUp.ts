export interface SignUpData {
  name: string;
  registrationNumber: string;
  verified: boolean;
  address: {
    city: string;
    state: string;
    country: string;
    pincode: number;
  };
  orgCategory: string;
  namePOC: string;
  phonePOC: number;
  association: string;
  addharPOC: number;
  email: string;
}
