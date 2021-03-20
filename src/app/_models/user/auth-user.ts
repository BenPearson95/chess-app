export class AuthUser {
  constructor(
    public firstname: string,
    public surname: string,
    public email: string,
    public token: string,
  ) {}
}
