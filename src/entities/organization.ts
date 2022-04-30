import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class Organization extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;
  @Column()
  name: string;
  @Column()
  label: string;
  @Column()
  website: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: false })
  isActive: boolean;
}
