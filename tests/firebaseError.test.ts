import { describe, expect, it } from 'vitest';

import { getFirebaseError } from '../src/utils';

describe('firebaseError', () => {
  it('auth/claims-too-large　を渡したら、予期せねエラーが発生しました。お手数ですが、お問い合わせフォームよりご連絡ください。　を返す', () => {
    const errorCode = 'auth/claims-too-large';

    const errorMessage = getFirebaseError(errorCode);
    expect(errorMessage).toBe(
      '予期せねエラーが発生しました。お手数ですが、お問い合わせフォームよりご連絡ください。'
    );
  });

  it('auth/invalid-email　を渡したら、メールアドレスを正しく入力してください。　を返す', () => {
    const errorCode = 'auth/invalid-email';

    const errorMessage = getFirebaseError(errorCode);
    expect(errorMessage).toBe('メールアドレスを正しく入力してください。');
  });

  it('""　を渡したら、""返す', () => {
    const errorCode = '';

    const errorMessage = getFirebaseError(errorCode);
    expect(errorMessage).toBe('');
  });
});
