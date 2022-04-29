import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Log  extends BaseEntity{
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  accessTokenId:string
  @Column()
  applicationId:string
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
}
