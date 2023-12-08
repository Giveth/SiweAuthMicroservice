import moment from 'moment';
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
 * Sign-In-With-Ethereum Nonce
 * Check the nonce during verification of Messages
 *
 * TODO: After integration with Solana, we don't only use SIWE.
 * We need to rename this entity to Nonce.
 */

@Entity()
export class SiweNonce extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Index()
  @Column()
  nonce: string;

  @Column()
  expirationDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  isExpired(): boolean {
    return this.expirationDate.valueOf() < moment().valueOf();
  }
}
