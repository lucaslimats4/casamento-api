import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Guest } from './guest.entity';

@Entity()
export class GuestGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Guest, guest => guest.group)
  guests: Guest[];
}