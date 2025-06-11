import { IsInt, IsString } from 'class-validator';

export class CreatePhongDTO {
  @IsString()
  MaPhong: string;

  @IsString()
  TenPhong: string;

  @IsInt()
  LoaiPhong: number;

  @IsInt()
  GiaPhong: number;

  @IsString()
  MoTa: string;

  @IsInt()
  SoLuong: number;
}
