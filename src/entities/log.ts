import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Application } from './application';
import { AccessToken } from './accessToken';

@Entity()
export class Log extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  serviceName: string;
  @Column()
  status: string;
  @Column()
  error: string;
  @Column()
  trackId: string;
  @Column()
  result: string;

  @Index()
  @ManyToOne(_type => Application)
  application: Application;
  @RelationId((log: Log) => log.application)
  applicationId: number;

  @Index()
  @ManyToOne(_type => AccessToken)
  accessToken: AccessToken;
  @RelationId((log: Log) => log.accessToken)
  accessTokenId: number;
}
