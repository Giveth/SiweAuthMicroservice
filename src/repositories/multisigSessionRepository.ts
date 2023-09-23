import moment from 'moment';
import { MultisigSession } from '../entities/multisigSession';

export const firstOrCreateMultisigSession = async (
  safeMessageHash: string,
  multisigAddress: string,
  network: number,
) => {
  let multisigSession = await findNonExpiredMultisigSessions(
    multisigAddress,
    network,
  );

  if (multisigSession) return multisigSession;

  multisigSession = MultisigSession.create({
    expirationDate: moment().add(1, 'week').toDate(),
    safeMessageHash,
    multisigAddress,
    network,
    active: true,
  });

  return multisigSession.save();
};

export const findNonExpiredMultisigSessions = async (
  multisigAddress: string,
  network: number,
) => {
  const session = await MultisigSession.createQueryBuilder('multisigSession')
    .where('multisigSession.network = :network', { network })
    .andWhere('multisigSession."multisigAddress" = :multisigAddress', {
      multisigAddress,
    })
    .getOne();

  if (!session) return null;

  if (session.didExpire()) {
    session.active = false;
    await session.save();
    return null;
  }

  return session;
};
