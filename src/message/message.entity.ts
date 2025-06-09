import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tbl_message')
export class Message {
  @PrimaryGeneratedColumn()
  messId: number;

  @Column({ type: 'varchar', length: 20 })
  User_send: string;

  @Column({ type: 'varchar', length: 16000 })
  Messages: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  Time: Date;
}
