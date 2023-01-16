import { EMAIL_REGEX, PASSWORD_REGEX } from '@/constants';

export const validateEmail = (email: string) => {
  const emailRegex = new RegExp(EMAIL_REGEX);
  if (!email) return false;
  if (!emailRegex.test(email)) return false;

  return true;
};

export const isValidPassword = (password: string) => {
  const passwordRegex = new RegExp(PASSWORD_REGEX);
  if (!password) return false;
  if (!passwordRegex.test(password)) return false;

  return true;
};
