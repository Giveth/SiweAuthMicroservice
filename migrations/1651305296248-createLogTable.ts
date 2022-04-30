import { MigrationInterface, QueryRunner } from "typeorm"

export class createLogTable1651305296248 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
          `
                      CREATE TABLE IF NOT EXISTS log
                            (
                                id integer NOT NULL,
                                "accessTokenId" character varying COLLATE pg_catalog."default" NOT NULL,
                                "serviceName" character varying COLLATE pg_catalog."default" NOT NULL,
                                status character varying COLLATE pg_catalog."default" NOT NULL,
                                error character varying COLLATE pg_catalog."default" NOT NULL,
                                "trackId" character varying COLLATE pg_catalog."default" NOT NULL,
                                result character varying COLLATE pg_catalog."default" NOT NULL,
                                "applicationId" integer,
                                CONSTRAINT "PK_350604cbdf991d5930d9e618fbd" PRIMARY KEY (id),
                                CONSTRAINT "FK_e8b5ceddd1f241d76fe2a79b057" FOREIGN KEY ("applicationId")
                                    REFERENCES public.application (id) MATCH SIMPLE
                                    ON UPDATE NO ACTION
                                    ON DELETE NO ACTION
                            )
          `
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS log`)
    }

}
