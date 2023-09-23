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

  @Index()
  @Column({ nullable: false })
  safeMessageHash: string;

  @Index()
  @Column({ nullable: false })
  safeTransactionHash: string;

  @Index()
  @Column({ nullable: false })
  network: number;

  @Column({ nullable: false, default: true })
  active: boolean;

  // https://docs.safe.global/safe-smart-account/signatures/eip-1271#fetching-the-signature-asynchronously
  // A fully signed message will have the status CONFIRMED,
  // confirmationsSubmitted >= confirmationsRequired
  // and a preparedSignature !== null.
  @Column({ nullable: true, default: MultisigStatuses.Pending })
  status: string;

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

  multisigStatus(safeMessageData: any): string {
    if (this.isExpired()) return MultisigStatuses.Failed;
    if (safeMessageData.status) return MultisigStatuses.Successful;

    return MultisigStatuses.Pending;
  }
}
