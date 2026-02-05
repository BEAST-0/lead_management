export class CreateUserDto {
  email: string;
  password: string;
  roleIds?: number[];
}
