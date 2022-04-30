import { MigrationInterface, QueryRunner } from 'typeorm';

export class createApplicationTable1651304945528 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS application
                (
                    id SERIAL NOT NULL,
                    label character varying COLLATE pg_catalog."default" NOT NULL,
                    name character varying COLLATE pg_catalog."default" NOT NULL,
                    secret character varying COLLATE pg_catalog."default" NOT NULL,
                    scopes text[] COLLATE pg_catalog."default" NOT NULL DEFAULT '{}'::text[],
                    "validIps" text[] COLLATE pg_catalog."default" NOT NULL DEFAULT '{}'::text[],
                    logo character varying COLLATE pg_catalog."default" NOT NULL,
                    "allowedRequestsPerHour" integer NOT NULL,
                    "isActive" boolean NOT NULL,
                    "organizationId" integer,
                    CONSTRAINT "PK_569e0c3e863ebdf5f2408ee1670" PRIMARY KEY (id),
                    CONSTRAINT "FK_88e675c3f80602005b728979e4a" FOREIGN KEY ("organizationId")
                        REFERENCES public.organization (id) MATCH SIMPLE
                        ON UPDATE NO ACTION
                        ON DELETE NO ACTION
                )

        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS application`);
  }
}
