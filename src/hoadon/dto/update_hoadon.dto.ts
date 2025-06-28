import { IsInt, IsOptional, IsString, IsNumber } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class UpdateHoaDonDTO {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  SoDien?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  GiaDien?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  SoNuoc?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  GiaNuoc?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  GiaPhong?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  ChiPhiKhac?: number;

  @IsString()
  @IsOptional()
  MaPhong?: string;

  @IsString()
  @IsOptional()
  MaNV?: string;

  @IsString()
  @IsOptional()
  NgayLap?: string;

  @IsString()
  @IsOptional()
  HanNop?: string;
}