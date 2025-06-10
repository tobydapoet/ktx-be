import { NhanVien } from 'src/nhanvien/nhanvien.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('thongbao')
export class Thongbao {
  @PrimaryGeneratedColumn()
  MaTB: number;

  @Column({ type: 'varchar', length: 180 })
  TieuDe: string;

  @Column({ type: 'varchar', length: 2550 })
  NoiDung: string;

  @Column({ type: 'date' })
  Ngay_tao: Date;

  @ManyToOne(() => NhanVien, (nhanvien) => nhanvien.MaNV)
  @JoinColumn({ name: 'MaNV' })
  MaNV: string;
}
