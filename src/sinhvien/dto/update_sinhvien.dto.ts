import { IsInt, IsString } from 'class-validator';

export class UpdateSinhVienDTO {
  @IsString()
  TenSV: string;

  @IsString()
  UserName: string;

  @IsString()
  MaPhong: string;

  @IsString()
  Phone: string;

  @IsString()
  CCCD: string;

  @IsString()
  DiaChi: string;

  @IsString()
  Class: string;

  @IsInt()
  GioiTinh: number;

  @IsString()
  Image: string;

  @IsString()
  ImageCCCDFront: string;

  @IsString()
  ImageCCCDBack: string;
}
