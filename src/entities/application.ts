import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Application extends BaseEntity{
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  label:string;
  @Column()
  name:string;
  @Column()
  secret: string
  @Column('text', { array: true, default: '{}' })
  scopes: string[]
  @Column('text', { array: true, default: '{}' })
  validIps: string[]
  @Column()
  logo ?: string
  @Column()
  allowedRequestsPerHour :number
  @Column()
  isActive: boolean

}
