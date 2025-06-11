import { IsString } from 'class-validator';

export class CreateThongBaoDTO {
  @IsString()
  MaTB: number;

  @IsString()
  TieuDe: string;

  @IsString()
  NoiDung: string;

  @IsString()
  MaNV: string;
}
