import { IsString } from 'class-validator';

export class UpdateThongBaoDTO {
  @IsString()
  TieuDe: string;

  @IsString()
  NoiDung: string;

  @IsString()
  MaNV: string;
}
