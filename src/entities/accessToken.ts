import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AccessToken extends BaseEntity{
  @PrimaryGeneratedColumn()
  readonly id: number;
  @Column()
  applicationId: number
  @Column()
  expirationDate: number
  @Column()
  value: string;
  @Column('text', { array: true, default: '{}' })
  scopes:string[]
  @Column()
  isActive : boolean
}
