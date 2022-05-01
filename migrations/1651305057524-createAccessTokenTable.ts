import { MigrationInterface, QueryRunner } from 'typeorm';

export class createAccessTokenTable1651305057524 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS public.access_token
                (
                    id SERIAL NOT NULL,
                    "expirationDate" integer,
                    jwt character varying COLLATE pg_catalog."default" NOT NULL,
                    jti character varying COLLATE pg_catalog."default" NOT NULL,
                    scopes text[] COLLATE pg_catalog."default" NOT NULL DEFAULT '{}'::text[],
                    "isActive" boolean NOT NULL,
                    "applicationId" integer,
                    CONSTRAINT "PK_f20f028607b2603deabd8182d12" PRIMARY KEY (id),
                    CONSTRAINT "FK_10c48d0d4ab60b391fe9fd9a014" FOREIGN KEY ("applicationId")
                        REFERENCES public.application (id) MATCH SIMPLE
                        ON UPDATE NO ACTION
                        ON DELETE NO ACTION
                )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS access_token`);
  }
}
