import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { GuestGroup } from './guest-group.entity';

@Entity()
export class Guest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: false })
  confirmed: boolean;

  @Column({ default: false })
  isChild: boolean;

  @ManyToOne(() => GuestGroup, group => group.guests, { nullable: true })
  @JoinColumn({ name: 'groupId' })
  group: GuestGroup;

  @Column({ nullable: true })
  groupId: number;
}