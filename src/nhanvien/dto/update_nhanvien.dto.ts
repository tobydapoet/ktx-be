import { IsInt, IsString } from 'class-validator';

export class UpdateNhanVienDTO {
  @IsString()
  TenNV: string;

  @IsString()
  UserName: string;

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
