import { EMAIL_REGEX, PASSWORD_REGEX } from '@/constants';

/**
 * メールアドレスが入力されていて、入力内容が正しければtrueを返す
 */
export const isValidEmail = (email: string) => {
  const emailRegex = new RegExp(EMAIL_REGEX);
  if (!email) return false;
  if (!emailRegex.test(email)) return false;

  return true;
};

/**
 * パスワードが入力されていて、入力内容が正しければtrueを返す
 */
export const isValidPassword = (password: string) => {
  const passwordRegex = new RegExp(PASSWORD_REGEX);
  if (!password) return false;
  if (!passwordRegex.test(password)) return false;

  return true;
};

/**
 * 引数で受け取ったblobが10MB以下の容量ならblobを返す
 */
export const validateBlobSize = (blob: Blob | null) => {
  if (!blob) {
    throw new Error(
      '画像読み込みに失敗しました。再度アップロードしてください。'
    );
  }

  // 画像容量制限
  // 単位byte
  const maxFileSize = 10 * 1024 * 1024;
  if (blob.size > maxFileSize) {
    throw new Error('画像サイズは１０MB以下にしてください');
  }

  return blob;
};
