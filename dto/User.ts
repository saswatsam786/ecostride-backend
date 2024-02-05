export interface UserSignUp {
  firstName: string;
  lastName: string;
  phone: string;
  gender: "male" | "female" | "other";
  email: string;
  password: string;
  userId: string;
}

export interface UserParam {
  id: string;
}
