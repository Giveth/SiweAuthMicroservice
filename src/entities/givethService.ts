import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Service Requested for access
 */

@Entity()
export class GivethService extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Index()
  @Column()
  serviceLabel: string;

  @Column()
  description: string;

  @Column('text', { array: true, default: '{}' })
  validIps: string[];

  @Column()
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
