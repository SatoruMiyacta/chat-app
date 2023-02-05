import { describe, expect, it } from 'vitest';
import { getCacheExpirationDate } from '../../src/utils';

describe('getCacheExpirationDate', () => {
  it('引数に0 を渡したら現在時刻 が返ってくる', () => {
    const date = new Date();
    const cacheExpirationDate = getCacheExpirationDate(0);

    expect(cacheExpirationDate).toStrictEqual(date);
  });

  it('引数に1 を渡したら1分後の時刻 が返ってくる', () => {
    const date = new Date();
    const cacheExpirationDate = getCacheExpirationDate(1);
    date.setMinutes(date.getMinutes() + 1);

    expect(cacheExpirationDate).toStrictEqual(date);
  });

  it('引数なしは5分後の時刻 が返ってくる', () => {
    const date = new Date();
    const cacheExpirationDate = getCacheExpirationDate();
    date.setMinutes(date.getMinutes() + 5);

    expect(cacheExpirationDate).toStrictEqual(date);
  });

  it('引数に負の値を渡したら、エラー が返ってくる', () => {
    const date = new Date();
    const cacheExpirationDate = getCacheExpirationDate(-1);

    expect(cacheExpirationDate).toThrowError();
  });

  it('引数に60 を渡したら1時間後の時刻 が返ってくる', () => {
    const date = new Date();
    const cacheExpirationDate = getCacheExpirationDate(60);
    date.setMinutes(date.getMinutes() + 60);

    expect(cacheExpirationDate).toStrictEqual(date);
  });

  it('引数に60*24 を渡したら1日後の時刻 が返ってくる', () => {
    const date = new Date();
    const cacheExpirationDate = getCacheExpirationDate(60 * 24);
    date.setMinutes(date.getMinutes() + 60 * 24);

    expect(cacheExpirationDate).toStrictEqual(date);
  });
});
