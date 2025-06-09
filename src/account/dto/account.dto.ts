import { IsString, IsInt, IsOptional, IsDateString } from 'class-validator';

export class AccountDTO {
  @IsString()
  Username: string;

  @IsString()
  Password: string;

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
