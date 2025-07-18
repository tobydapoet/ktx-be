import { IsInt, IsString } from 'class-validator';

export class SinhVienDTO {
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

  @IsString()
  Image: string;

  @IsString()
  ImageCCCDFront: string;

  @IsString()
  ImageCCCDBack: string;

  @IsInt()
  TrangThai: string;
}
