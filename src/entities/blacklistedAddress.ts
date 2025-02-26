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
  export class BlacklistedAddress extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;
  
    @Index({ unique: true })
    @Column({ unique: true })
    publicAddress: string;    
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  