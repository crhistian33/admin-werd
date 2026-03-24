import { LoginPayload } from '../models/auth-request.interface';

export namespace AuthActions {
  export class Login {
    static readonly type = '[Auth] Login';
    constructor(public payload: LoginPayload) {}
  }

  export class Logout {
    static readonly type = '[Auth] Logout';
  }

  export class RefreshToken {
    static readonly type = '[Auth] Refresh Token';
  }

  export class RefreshTokenSuccess {
    static readonly type = '[Auth] Refresh Token Success';
    constructor(public accessToken: string) {}
  }

  export class RestoreSession {
    static readonly type = '[Auth] Restore Session';
  }
}
