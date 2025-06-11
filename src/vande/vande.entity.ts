import { NhanVien } from 'src/nhanvien/nhanvien.entity';
import { SinhVien } from 'src/sinhvien/sinhvien.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('tbl_vande')
export class VanDe {
  @PrimaryGeneratedColumn()
  MaVD: number;

  @Column({ type: 'varchar', length: 180 })
  TieuDe: string;

  @Column({ type: 'varchar', length: 2550 })
  NoiDung: string;

  @Column({ type: 'varchar', length: 2550, nullable: true })
  PhanHoi: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  MaNV: string | null;

  @Column({ type: 'varchar', length: 20 })
  MaSV: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  Ngay_tao: Date;

  @ManyToOne(() => NhanVien, (nhanvien) => nhanvien.vanDes)
  @JoinColumn({ name: 'MaNV', referencedColumnName: 'MaNV' })
  nhanvien: NhanVien;

  @ManyToOne(() => SinhVien, (sinhvien) => sinhvien.vanDes)
  @JoinColumn({ name: 'MaSV', referencedColumnName: 'MaSV' })
  sinhvien: SinhVien;
}
