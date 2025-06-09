import { IsBase64, IsInt, IsString } from 'class-validator';

export class CreateSinhVienDTO {
  @IsString()
  MaSV: string;

  @IsString()
  TenSV: string;

  @IsString()
  Username: string;

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

  @IsBase64()
  Image: string;

  @IsBase64()
  ImageCCCDFront: string;

  @IsBase64()
  ImageCCCDBack: string;
}
