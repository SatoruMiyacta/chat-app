import { describe, expect, it } from 'vitest';

import { getFirebaseError } from '../../src/utils';

describe('getFirebaseError', () => {
  it('引数にfirebaseのエラーコードを渡したら、該当するエラーメッセージを返す', () => {
    const errorCode = 'auth/claims-too-large';

    const errorMessage = getFirebaseError(errorCode);
    expect(errorMessage).toBe(
      '予期せぬエラーが発生しました。お手数ですが、お問い合わせフォームよりご連絡ください。'
    );
  });

  it('引数の文字列に該当するfirebaseのエラーコードがなかったら、空の文字列を返す', () => {
    const errorCode = '';

    const errorMessage = getFirebaseError(errorCode);
    expect(errorMessage).toBe('');
  });
});
