import { IsBase64, IsInt, IsString } from 'class-validator';

export class CreateNhanVienDTO {
  @IsString()
  MaNV: string;

  @IsString()
  TenNV: string;

  @IsString()
  Username: string;

  @IsString()
  Phone: string;

  @IsString()
  CCCD: string;

  @IsString()
  DiaChi: string;

  @IsInt()
  GioiTinh: number;

  @IsBase64()
  Image: string;

  @IsBase64()
  ImageCCCDFront: string;

  @IsBase64()
  ImageCCCDBack: string;
}
