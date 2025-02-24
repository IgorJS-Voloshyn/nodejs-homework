import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  register,
  login,
  logout,
  refresh,
  requestResetEmail,
  resetPassword,
} from '../controllers/auth.js';
import {
  registerSchema,
  loginSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';
import { validateBody } from '../middlewares/validateBody.js';

const router = express.Router();
const jsonParser = express.json();

router.post(
  '/auth/register',
  jsonParser,
  validateBody(registerSchema),
  ctrlWrapper(register),
);

router.post(
  '/auth/login',
  jsonParser,
  validateBody(loginSchema),
  ctrlWrapper(login),
);

router.post('/auth/refresh', ctrlWrapper(refresh));

router.post('/auth/logout', ctrlWrapper(logout));

router.post(
  '/auth/send-reset-email',
  jsonParser,
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmail),
);
router.post(
  '/auth/reset-pwd',
  jsonParser,
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPassword),
);

export default router;
