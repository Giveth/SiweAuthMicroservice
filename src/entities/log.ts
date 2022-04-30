import { BaseEntity, Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { Application } from "./application";

@Entity()
export class Log  extends BaseEntity{
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  accessTokenId:string

  @Column()
  serviceName:string
  @Column()
  status:string
  @Column()
  error: string
  @Column()
  trackId: string
  @Column()
  result: string

  @Index()
  @ManyToOne(type => Application)
  application: Application;
  @RelationId((log: Log) => log.application)
  applicationId: number;
}
