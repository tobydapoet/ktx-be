import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('blacklist')
export class Blacklist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  access_token: string;

  @Column({ type: 'text' })
  refresh_token: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;
}
