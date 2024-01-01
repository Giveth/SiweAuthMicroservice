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
    const table = await queryRunner.getTable('multisig_session');
    if (!table) return;

    const safeTransactionHashColumnExists = table.columns.some(
      c => c.name === 'safeTransactionHash',
    );
    if (safeTransactionHashColumnExists) {
      await queryRunner.dropColumn('multisig_session', 'safeTransactionHash');
    }

    // Adding new columns
    const statusColumnExists = table.columns.some(c => c.name === 'status');
    if (!statusColumnExists) {
      await queryRunner.addColumn(
        'multisig_session',
        new TableColumn({
          name: 'status',
          type: 'varchar',
          isNullable: true,
        }),
      );
    }

    // Renaming column safeTransactionMessage to safeMessageHash
    const safeTransactionMessageColumnExists = table.columns.some(
      c => c.name === 'safeTransactionMessage',
    );
    if (safeTransactionMessageColumnExists) {
      await queryRunner.renameColumn(
        'multisig_session',
        'safeTransactionMessage',
        'safeMessageHash',
      );
    }

    // Creating indices for safeMessageHash
    const safeMessageHashIndexExists = table.indices.some(
      idx => idx.columnNames.indexOf('safeMessageHash') !== -1,
    );
    if (!safeMessageHashIndexExists) {
      await queryRunner.createIndex(
        'multisig_session',
        new TableIndex({
          name: 'IDX_MULTISIG_SAFE_MESSAGE_HASH',
          columnNames: ['safeMessageHash'],
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('multisig_session');
    if (!table) return;

    // Dropping indices for messageHash and safeMessageHash
    const safeMessageHashIndexExists = table.indices.some(
      idx => idx.columnNames.indexOf('safeMessageHash') !== -1,
    );
    if (safeMessageHashIndexExists) {
      await queryRunner.dropIndex(
        'multisig_session',
        'IDX_MULTISIG_SAFE_MESSAGE_HASH',
      );
    }

    // Renaming column back to safeTransactionMessage
    const safeMessageHashColumnExists = table.columns.some(
      c => c.name === 'safeMessageHash',
    );
    if (safeMessageHashColumnExists) {
      await queryRunner.renameColumn(
        'multisig_session',
        'safeMessageHash',
        'safeTransactionMessage',
      );
    }

    // Dropping the added columns
    const statusColumnExists = table.columns.some(c => c.name === 'status');
    if (statusColumnExists) {
      await queryRunner.dropColumn('multisig_session', 'status');
    }
  }
}
