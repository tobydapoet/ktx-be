import { IsInt, IsString } from 'class-validator';

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

  @IsString()
  Image: string;

  @IsString()
  ImageCCCDFront: string;

  @IsString()
  ImageCCCDBack: string;
}
