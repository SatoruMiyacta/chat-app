import { describe, expect, it, vi } from 'vitest';
import { fetchUserData, isCacheActive } from '../../src/utils';

describe('fetchUserData,isCacheActive', () => {
  describe('fetchUserData', () => {
    it('ランダムなID を渡したらundefined が返ってくる', async () => {
      const userId = 'test123456test';
      const userData = await fetchUserData(userId);

      expect(userData).toBeUndefined();
    });
  });

  describe('isCacheActive', () => {
    it('expiresInを現在時刻にしたら、falseが返ってくる', () => {
      const now = new Date();
      const userData = {
        name: 'test',
        iconUrl: 'test',
        createdAt: now,
        updatedAt: now,
      };
      const userObject = {
        data: userData,
        expiresIn: now,
      };

      expect(isCacheActive(userObject)).toBe(false);
    });

    it('現在時刻から1分後のデータ を渡したらtrue が返ってくる', () => {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 1);
      const userData = {
        name: 'test',
        iconUrl: 'test',
        createdAt: now,
        updatedAt: now,
      };
      const userObject = {
        data: userData,
        expiresIn: now,
      };

      expect(isCacheActive(userObject)).toBe(true);
    });

    it('現在時刻から1分前のデータ を渡したらfalse が返ってくる', () => {
      const now = new Date();
      console.log(now);
      now.setMinutes(now.getMinutes() - 1);
      console.log(now);
      const userData = {
        name: 'test',
        iconUrl: 'test',
        createdAt: now,
        updatedAt: now,
      };
      const userObject = {
        data: userData,
        expiresIn: now,
      };

      expect(isCacheActive(userObject)).toBe(false);
    });
  });
});
