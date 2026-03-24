export interface AdminInfo {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  admin: AdminInfo;
}

export interface RefreshResponse {
  accessToken: string;
}
