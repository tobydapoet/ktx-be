import { NhanVien } from 'src/nhanvien/nhanvien.entity';
import { Phong } from 'src/phong/phong.entity';
import { SinhVien } from 'src/sinhvien/sinhvien.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('tbl_hopdong')
export class HopDong {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  MaHD: string;

  @Column({ type: 'varchar' })
  MaPhong: string;

  @Column({ type: 'date' })
  NgayBD: Date;

  @Column({ type: 'date' })
  NgayKT: Date;

  @Column({ type: 'varchar', length: 20 })
  MaSV: string;

  @Column({ type: 'varchar', length: 20 })
  MaNV: string;

  @ManyToOne(() => Phong, (phong) => phong.hopDongs)
  @JoinColumn({ name: 'MaPhong', referencedColumnName: 'MaPhong' })
  phongs: Phong;

  @ManyToOne(() => NhanVien, (nhanvien) => nhanvien.hopDongs)
  @JoinColumn({ name: 'MaNV', referencedColumnName: 'MaNV' })
  nhanViens: NhanVien;

  @ManyToOne(() => SinhVien, (sinhvien) => sinhvien.hopDongs)
  @JoinColumn({ name: 'MaSV', referencedColumnName: 'MaSV' })
  sinhvViens: NhanVien;
}
