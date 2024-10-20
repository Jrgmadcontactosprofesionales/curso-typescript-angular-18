export enum UserType {
  Admin = 'admin',
  ReadOnly = 'readonly',
}

export interface User {
  id: string;
  username: string;
  password: string;
  userType: UserType;
}
