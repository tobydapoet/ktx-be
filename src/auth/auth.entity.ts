import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tbl_auth')
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cccd: string;

  @Column({ nullable: true })
  twoFaSecret: string;
}
