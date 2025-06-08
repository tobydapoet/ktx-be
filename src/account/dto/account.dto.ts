import { IsString, IsInt, IsOptional, IsDateString } from 'class-validator';

export class AccountDTO {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsInt()
  ChucVu: number;

  @IsDateString()
  DateTime?: string;

  @IsInt()
  online?: number;

  @IsOptional()
  @IsString()
  log?: string;
}
