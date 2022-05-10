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
import { GivethService } from './givethService';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Index()
  @ManyToOne(() => GivethService)
  givethService: GivethService;
  @RelationId((accessToken: AccessToken) => accessToken.givethService)
  givethServiceId: number;
}
