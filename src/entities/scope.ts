import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Scope extends BaseEntity{
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  label:string
  @Column()
  description: string
}
