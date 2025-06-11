import { IsInt, IsString } from 'class-validator';

export class RegisterDTO {
  @IsString()
  Username: string;

  @IsString()
  Password: string;

  @IsInt()
  ChucVu: number;
}
