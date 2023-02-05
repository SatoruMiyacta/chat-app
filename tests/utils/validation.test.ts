import { describe, expect, it } from 'vitest';
import {
  isValidEmail,
  isValidPassword,
  validateBlobSize,
} from '../../src/utils';

describe('isValidEmail', () => {
  it('test.gmail.com を渡したら、falseを返す', () => {
    const email = 'test.gmail.com';
    const validEmail = isValidEmail(email);

    expect(validEmail).toBe(false);
  });

  it('@gmail.comを渡したら、falseを返す', () => {
    const email = '@gmail.com';
    const validEmail = isValidEmail(email);

    expect(validEmail).toBe(false);
  });

  it('test@gmail,comを渡したら、falseを返す', () => {
    const email = 'test@gmail,com';
    const validEmail = isValidEmail(email);

    expect(validEmail).toBe(false);
  });

  it('testを渡したら、falseを返す', () => {
    const email = 'test';
    const validEmail = isValidEmail(email);

    expect(validEmail).toBe(false);
  });

  it('😄を渡したら、falseを返す', () => {
    const email = '😄';
    const validEmail = isValidEmail(email);

    expect(validEmail).toBe(false);
  });

  it('テスト@gmail.comを渡したら、falseを返す', () => {
    const email = 'テスト@gmail.com';
    const validEmail = isValidEmail(email);

    expect(validEmail).toBe(false);
  });
});

describe('isValidPassword', () => {
  it('パスワードテストを渡したら、falseを返す', () => {
    const password = 'パスワードテスト';
    const validPassword = isValidPassword(password);

    expect(validPassword).toBe(false);
  });

  it('123456789を渡したら、falseを返す', () => {
    const password = '123456789';
    const validPassword = isValidPassword(password);

    expect(validPassword).toBe(true);
  });

  it('😄😄😄😄😄😄を渡したら、falseを返す', () => {
    const password = '😄😄😄😄😄😄';
    const validPassword = isValidPassword(password);

    expect(validPassword).toBe(false);
  });
});

describe('validateBlobSize', () => {
  it('制限に引っかからないサイズ(10MB)のblobを渡したら、blobを返す', () => {
    let str = '';

    // 単位はbyte
    const fileSize = 10485760;

    for (let i = 0; str.length < fileSize; i++) {
      str = str + 't';
    }

    const blob = new Blob([str], { type: 'text' });

    const file = validateBlobSize(blob);

    expect(file).toEqual(blob);
  });

  it('制限に引っかからないサイズ(10485759Byte)のblobを渡したら、blobを返す', () => {
    let str = '';

    // 単位はbyte
    const fileSize = 10485759;

    for (let i = 0; str.length < fileSize; i++) {
      str = str + 't';
    }

    const blob = new Blob([str], { type: 'text' });

    const file = validateBlobSize(blob);

    expect(file).toEqual(blob);
  });

  it('制限に引っかかるサイズ(10485761Byte)のblobを渡したら、画像サイズは１０MB以下にしてください を返す', () => {
    let str = '';

    // 単位はbyte
    const fileSize = 10485761;

    for (let i = 0; str.length < fileSize; i++) {
      str = str + 't';
    }

    const blob = new Blob([str], { type: 'text' });

    expect(() => {
      validateBlobSize(blob);
    }).toThrow();
  });
});
