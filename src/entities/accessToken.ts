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

@Entity()
export class AccessToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Index()
  @Column('text')
  jwt: string;

  @Index()
  @Column('text')
  jti: string;

  @Column()
  publicAddress: string;

  @Column()
  expirationDate: Date;

  @Column({ default: false })
  isBlacklisted: boolean;

  @Column({ default: false })
  isExpired: boolean;

  didExpire(): boolean {
    return this.expirationDate.valueOf() < moment().valueOf();
  }

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
