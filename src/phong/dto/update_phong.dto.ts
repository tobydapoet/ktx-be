import { IsInt, IsString } from 'class-validator';

export class UpdatePhongDTO {
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

  @IsInt()
  SoSV: number;
}
