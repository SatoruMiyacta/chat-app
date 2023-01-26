import { describe, expect, it } from 'vitest';
import { i } from 'vitest/dist/index-220c1d70';
import {
  test,
  isValidEmail,
  isValidPassword,
  validateBlobSize,
} from '../src/utils';

// // discribeがtestのブロックを作る関数
// // 引数にtestブロック名とコールバック関数
// describe('test', () => {
//   // itは一つのtestにつき、一つ作る
//   // 日付をYYYY/MM/DDで返すtest
//   it('今日の日付をYYYY/MM/DDで返す', () => {
//     const date = new Date(2023, 11, 1);
//     // console.log(date)
//     const dateTest = test(date);
//     // expectが検査したい値
//     // tobeがイコール正しいか検査する
//     expect(dateTest).toBe('2023/12/01');
//   });

//   it('今日の日付をYYYY/MM/DDで返す', () => {
//     const date = new Date(2023, 0, 1);
//     // console.log(date)
//     const dateTest = test(date);
//     // expectが検査したい値
//     // tobeがイコール正しいか検査する
//     expect(dateTest).toBe('2023/01/01');
//   });
// });

describe('/utils/validation', () => {
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

describe('/utils/validation', () => {
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

describe('/utils/validation', () => {
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
    // console.log(blob.size);

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
