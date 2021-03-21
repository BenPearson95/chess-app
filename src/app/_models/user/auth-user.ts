export class AuthUser {
  constructor(
    public _id: string,
    public firstname: string,
    public surname: string,
    public email: string,
    public accountType: string,
    public token: string,
  ) {}
}
