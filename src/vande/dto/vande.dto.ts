import { IsOptional, IsString } from 'class-validator';

export class CreateVanDeDTO {
  @IsString()
  TieuDe: string;

  @IsString()
  NoiDung: string;

  @IsOptional()
  @IsString()
  MaNV?: string | null;

  @IsString()
  MaSV: string;
}

export class UpdateVanDeDTO {
  @IsOptional()
  @IsString()
  TieuDe?: string;

  @IsOptional()
  @IsString()
  NoiDung?: string;

  @IsOptional()
  @IsString()
  PhanHoi?: string;

  @IsOptional()
  @IsString()
  MaNV?: string | null;
}
