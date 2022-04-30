import { MigrationInterface, QueryRunner } from "typeorm"

export class createOrganizationTable1651303031278 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
       await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS organization
                (
                    id integer NOT NULL,
                    name character varying COLLATE pg_catalog."default" NOT NULL,
                    label character varying COLLATE pg_catalog."default" NOT NULL,
                    website character varying COLLATE pg_catalog."default" NOT NULL,
                    "isVerified" boolean NOT NULL DEFAULT false,
                    "isActive" boolean NOT NULL DEFAULT false,
                    CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY (id)
                )
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS organization`)
    }

}
