import moment from 'moment';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
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
  issuer: string;

  @Column()
  expirationDate: Date;

  @Column()
  isBlacklisted: boolean;

  @Column()
  isExpired: boolean;

  didExpire(): boolean {
    return this.expirationDate.valueOf() < moment().valueOf();
  }

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
