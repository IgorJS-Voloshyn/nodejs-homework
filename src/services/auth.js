import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import handlebars from 'handlebars';
import jwt from 'jsonwebtoken';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import { sendEmail } from '../utils/sendEmail.js';
import {
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL,
  SMTP,
  TEMPLATE_DIR,
} from '../constants/index.js';

import httpErrors from 'http-errors';
const { NotFound, InternalServerError } = httpErrors;

async function registerUser(user) {
  const maybeUser = await User.findOne({ email: user.email });

  if (maybeUser !== null) {
    throw createHttpError(409, 'Email in use');
  }

  user.password = await bcrypt.hash(user.password, 10);

  return User.create(user);
}

async function loginUser(email, password) {
  const maybeUser = await User.findOne({ email });

  if (maybeUser === null) {
    throw createHttpError(404, 'User not found');
  }

  const isMatch = await bcrypt.compare(password, maybeUser.password);

  if (isMatch === false) {
    throw createHttpError(401, 'Unauthorize');
  }

  await Session.deleteOne({ userId: maybeUser._id });

  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  return Session.create({
    userId: maybeUser._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TTL),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TTL),
  });
}

async function refreshUserSession(sessionId, refreshToken) {
  const session = await Session.findOne({ _id: sessionId, refreshToken });

  if (session === null) {
    throw createHttpError(401, 'Session not found');
  }

  if (new Date() > new Date(session.refreshTokenValidUntil)) {
    throw createHttpError(401, 'Refresh token is expired');
  }

  await Session.deleteOne({ _id: session._id });

  return Session.create({
    userId: session.userId,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TTL),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TTL),
  });
}

function logoutUser(sessionId) {
  return Session.deleteOne({ _id: sessionId });
}

async function requestResetEmail(email) {
  const user = await User.findOne({ email });

  if (user === null) {
    throw NotFound('User not found');
  }
  if (email === null) {
    throw InternalServerError(
      'Failed to send the email, please try again later.',
    );
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '25m',
    },
  );
  console.log(resetToken);
  const templateFile = path.join(TEMPLATE_DIR, 'reset-password-email.html');

  const templateSource = await fs.readFile(templateFile, { encoding: 'utf-8' });

  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.name,
    link: `https://google.com/reset-password?token=${resetToken}`,
  });
  await sendEmail({
    from: SMTP.FROM_EMAIL,
    to: email,
    subject: 'Reset your password',
    html,
  });
}

async function resetPassword(password, token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ _id: decoded.sub, email: decoded.email });

    if (user === null) {
      throw NotFound('User not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
  } catch (error) {
    if (
      error.name === 'TokenExpiredError' ||
      error.name === 'JsonWebTokenError'
    ) {
      throw createHttpError(401, 'Token is expired or invalid.');
    }

    throw error;
  }
}
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshUserSession,
  requestResetEmail,
  resetPassword,
};
