import { MultisigStatuses } from '@/src/entities/multisigSession';
import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from 'typeorm';

export class UpdateMultisigSessionEntity1695476070385
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adding new columns
    await queryRunner.addColumn(
      'multisig_session',
      new TableColumn({
        name: 'messageHash',
        type: 'varchar',
        isNullable: false,
      }),
    );
    await queryRunner.addColumn(
      'multisig_session',
      new TableColumn({
        name: 'status',
        type: 'varchar',
        isNullable: true,
      }),
    );

    // Renaming column safeTransactionMessage to safeMessageHash
    await queryRunner.renameColumn(
      'multisig_session',
      'safeTransactionMessage',
      'safeMessageHash',
    );

    // Creating indices for messageHash and safeMessageHash
    await queryRunner.createIndex(
      'multisig_session',
      new TableIndex({
        name: 'IDX_MULTISIG_MESSAGE_HASH',
        columnNames: ['messageHash'],
      }),
    );
    await queryRunner.createIndex(
      'multisig_session',
      new TableIndex({
        name: 'IDX_MULTISIG_SAFE_MESSAGE_HASH',
        columnNames: ['safeMessageHash'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Dropping indices for messageHash and safeMessageHash
    await queryRunner.dropIndex(
      'multisig_session',
      'IDX_MULTISIG_MESSAGE_HASH',
    );
    await queryRunner.dropIndex(
      'multisig_session',
      'IDX_MULTISIG_SAFE_MESSAGE_HASH',
    );

    // Renaming column back to safeTransactionMessage
    await queryRunner.renameColumn(
      'multisig_session',
      'safeMessageHash',
      'safeTransactionMessage',
    );

    // Dropping the added columns
    await queryRunner.dropColumn('multisig_session', 'isSuccessful');
    await queryRunner.dropColumn('multisig_session', 'messageHash');
  }
}
