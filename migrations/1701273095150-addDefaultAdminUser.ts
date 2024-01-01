import { Admin, AdminRole } from '@/src/entities/admin';
import { MigrationInterface, QueryRunner } from 'typeorm';
const bcrypt = require('bcrypt');

export class addDefaultAdminUser1701273095150 implements MigrationInterface {
  private defaultAdminEmail = 'admin@example.com';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const isStagingOrLocal =
      process.env.ENVIRONMENT === 'local' ||
      process.env.ENVIRONMENT === 'staging' ||
      process.env.ENVIRONMENT === 'develop';

    if (isStagingOrLocal) {
      const defaultAdmin = new Admin();
      defaultAdmin.email = this.defaultAdminEmail;
      const hash = await bcrypt.hash(
        'password',
        Number(process.env.BCRYPT_SALT),
      );
      defaultAdmin.encryptedPassword = hash; // Set your default password here

      // Assign a default role if needed
      defaultAdmin.role = AdminRole.ADMIN;

      await queryRunner.manager.save(defaultAdmin);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(Admin)
      .where('email = :email', { email: this.defaultAdminEmail })
      .execute();
  }
}
