import createHttpError from 'http-errors';

import { User } from '../models/user.js';
import { Session } from '../models/session.js';

export async function authenticate(req, res, next) {
  const [bearer, accessToken] = req.headers.authorization.split(' ', 2);
  const session = await Session.findOne({ accessToken });

  if (new Date() > new Date(session.accessTokenValidUntil)) {
    return next(createHttpError(401, 'Access token is expired'));
  }

  const user = await User.findOne({ _id: session.userId });
  req.user = user;

  next();
}
