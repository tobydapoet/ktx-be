import { NhanVien } from 'src/nhanvien/nhanvien.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('tbl_thongbao')
export class ThongBao {
  @PrimaryGeneratedColumn()
  MaTB: number;

  @Column({ type: 'varchar', length: 180 })
  TieuDe: string;

  @Column({ type: 'varchar', length: 2550 })
  NoiDung: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  ThoiGian: Date;

  @Column({ type: 'varchar', length: 20 })
  MaNV: string;

  @ManyToOne(() => NhanVien, (nhanvien) => nhanvien.thongBaos)
  @JoinColumn({ name: 'MaNV' })
  nhanvien: NhanVien;
}
