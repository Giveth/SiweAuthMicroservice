import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

const Cryptr = require('cryptr');

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
  jwtSecret: string;

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

  decryptedJwtSecret(): string {
    const cryptr = new Cryptr(process.env.SECRETS_ENCRYPTION_KEY);
    return cryptr.decrypt(this.jwtSecret);
  }
}
