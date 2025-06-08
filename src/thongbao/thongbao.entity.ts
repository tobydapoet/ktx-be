import { NhanVien } from 'src/nhanvien/nhanvien.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tbl_thongbao')
export class ThongBao {
  @PrimaryGeneratedColumn()
  MaTB: number;

  @Column({ type: 'varchar', length: 180 })
  TieuDe: string;

  @Column({ type: 'varchar', length: 2550 })
  NoiDung: string;

  @Column({ type: 'varchar', length: 20 })
  MaNV: string;

  @ManyToOne(() => NhanVien, (nhanvien) => nhanvien.thongBaos)
  nhanvien: NhanVien;
}
