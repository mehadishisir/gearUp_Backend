export interface ILogInUser {
    email:string,
    password:string
}
export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  phone: string,
  role: "CUSTOMER" | "PROVIDER";
}