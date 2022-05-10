import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

export enum AdminRole {
  ADMIN = 'admin',
  SUPER_ADMIN = 'superAdmin',
  OPERATOR = 'operator',
}

@Entity()
@Unique(['email'])
export class Admin extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('text', { nullable: true })
  public firstName?: string;

  @Column('text', { nullable: true })
  public lastName?: string;

  @Column({
    type: 'enum',
    enum: AdminRole,
    default: AdminRole.OPERATOR,
  })
  role: AdminRole;

  @Index({ unique: true })
  @Column({ type: 'text' })
  public email: string;

  @Column({ type: 'text' })
  public encryptedPassword: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
