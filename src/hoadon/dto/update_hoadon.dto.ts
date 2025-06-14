import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateHoaDonDTO {
  @IsInt()
  SoDien: number;

  @IsInt()
  GiaDien: number;

  @IsInt()
  SoNuoc: number;

  @IsInt()
  GiaNuoc: number;

  @IsInt()
  GiaPhong: number;

  @IsInt()
  @IsOptional()
  ChiPhiKhac?: number;

  @IsString()
  MaPhong: string;

  @IsString()
  MaNV: string;

  @IsString()
  @IsOptional()
  NgayLap?: string;

  @IsString()
  @IsOptional()
  HanNop?: string;
}
