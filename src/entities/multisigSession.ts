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
  NotFound = 'not found',
}

@Entity()
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

  @Column({ nullable: true })
  approvalExpirationDate: Date;

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

  async multisigStatus(
    safeMessageData: {
      confirmations?: Array<unknown>;
      preparedSignature?: string | null;
    },
    confirmationsRequired: number,
  ): Promise<string> {
    if (this.isExpired()) {
      this.status = MultisigStatuses.Failed;
      await this.save();
      return this.status;
    }

    const confirmationsSubmitted = Array.isArray(safeMessageData?.confirmations)
      ? safeMessageData.confirmations.length
      : 0;
    const hasPreparedSignature = Boolean(safeMessageData?.preparedSignature);

    if (
      hasPreparedSignature &&
      confirmationsSubmitted >= confirmationsRequired
    ) {
      this.status = MultisigStatuses.Successful;
    } else {
      this.status = MultisigStatuses.Pending;
    }

    await this.save();
    return this.status;
  }
}
