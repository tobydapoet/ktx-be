import { NhanVien } from 'src/nhanvien/nhanvien.entity';
import { SinhVien } from 'src/sinhvien/sinhvien.entity';
import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('tbl_account')
export class Account {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  username: string;

  @Column({ type: 'varchar', length: 20 })
  password: string;

  @Column({ type: 'int' })
  ChucVu: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  DateTime: Date;

  @Column({ type: 'int', default: 0 })
  online: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  log: string;

  @OneToOne(() => NhanVien, (nhanvien) => nhanvien.account)
  nhanvien: NhanVien;

  @OneToOne(() => SinhVien, (sinhvien) => sinhvien.account)
  sinhvien: SinhVien;
}
