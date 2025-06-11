import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tbl_chat')
export class Chat {
  @PrimaryGeneratedColumn()
  messId: number;

  @Column({ type: 'varchar', length: 20 })
  User_send: string;

  @Column({ type: 'varchar', length: 20 })
  User_get: string;
}
