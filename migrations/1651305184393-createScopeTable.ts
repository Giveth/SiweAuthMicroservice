import { MigrationInterface, QueryRunner } from 'typeorm';

export class createScopeTable1651305184393 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS scope
                (
                    id SERIAL NOT NULL,
                    label character varying COLLATE pg_catalog."default" NOT NULL,
                    description character varying COLLATE pg_catalog."default" NOT NULL,
                    CONSTRAINT "PK_d3425631cbb370861a58c3e88c7" PRIMARY KEY (id)
                )
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS scope`);
  }
}
