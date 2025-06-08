import { HoaDon } from 'src/hoadon/hoadon.entity';
import { HopDong } from 'src/hopdong/hopdong.entity';
import { SinhVien } from 'src/sinhvien/sinhvien.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('tbl_phong')
export class Phong {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  MaPhong: string;

  @Column({ type: 'varchar', length: 50 })
  TenPhong: string;

  @Column({ type: 'int' })
  LoaiPhong: number;

  @Column({ type: 'int', default: 0 })
  GiaPhong: number;

  @Column({ type: 'varchar', length: 2000, default: 'Không có mô tả' })
  MoTa: string;

  @Column({ type: 'int', default: 0 })
  SoLuong: number;

  @Column({ type: 'int', default: 0 })
  SoSV: number;

  @Column({ type: 'int', default: 0 })
  TrangThai: number;

  @OneToMany(() => SinhVien, (sinhvien) => sinhvien.phong)
  sinhViens: SinhVien[];

  @OneToMany(() => HoaDon, (hoadon) => hoadon.phongs)
  hoaDons: HoaDon[];

  @OneToMany(() => HopDong, (hopdong) => hopdong.phongs)
  hopDongs: HopDong[];
}
