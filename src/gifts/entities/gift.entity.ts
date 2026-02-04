import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Gift {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  image: string;

  @Column({ default: false })
  purchased: boolean;
}