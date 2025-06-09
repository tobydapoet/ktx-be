import { IsString } from 'class-validator';

export class LoginDTO {
  @IsString()
  Username: string;

  @IsString()
  Password: string;
}
