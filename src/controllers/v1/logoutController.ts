import { Route, Get, Tags, Post } from 'tsoa';
import { AccessToken } from '../../entities/accessToken';
import { errorMessagesEnum } from '../../utils/errorMessages';
import { MESSAGES } from '../../utils/messages';

type HealthResponse = {
  message: string;
};

@Route('/v1/logout')
@Tags('LogOut')
export class LogoutController {
  @Post('/')
  public async logOut(
    jwt: string,
   ): Promise<Boolean> {
    const token = await AccessToken.createQueryBuilder()
      .where('jwt = :jwt', { jwt: jwt })
      .getOne();

    if(!token) throw errorMessagesEnum.JWT_NOT_FOUND;

    token.isBlacklisted = true;
    await token.save();

    return true;
  }
}
