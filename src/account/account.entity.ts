import { NhanVien } from 'src/nhanvien/nhanvien.entity';
import { SinhVien } from 'src/sinhvien/sinhvien.entity';
import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('tbl_account')
export class Account {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  Username: string;

  @Column({ type: 'varchar', length: 20 })
  Password: string;

  @Column({ type: 'int' })
  ChucVu: number;

  @OneToOne(() => NhanVien, (nhanvien) => nhanvien.account)
  nhanvien: NhanVien;

  @OneToOne(() => SinhVien, (sinhvien) => sinhvien.account)
  sinhvien: SinhVien;
}
