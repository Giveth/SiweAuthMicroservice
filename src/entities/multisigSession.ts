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

export enum MultisigStatuses {
  Pending = 'pending',
  Failed = 'failed',
  Successful = 'successful',
}

@Entity()
@Index(['safeTransactionHash', 'network'], { unique: true })
export class MultisigSession extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Index()
  @Column({ nullable: true })
  multisigAddress: string;

  @Column({ nullable: false })
  safeTransactionMessage: string;

  @Index()
  @Column({ nullable: false })
  safeTransactionHash: string;

  @Index()
  @Column({ nullable: false })
  network: number;

  @Column({ nullable: false, default: true })
  active: boolean;

  @Column({ nullable: false })
  expirationDate: Date;

  didExpire(): boolean {
    return this.expirationDate.valueOf() < moment().valueOf();
  }

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  isExpired(): boolean {
    return this.expirationDate.valueOf() < moment().valueOf();
  }

  multisigStatus(isSuccessful?: boolean): string {
    if (isSuccessful) return MultisigStatuses.Successful;

    return MultisigStatuses.Pending;
  }
}
