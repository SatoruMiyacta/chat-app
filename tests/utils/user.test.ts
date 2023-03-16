import firebase from 'firebase/firestore';
import { describe, expect, it, vi } from 'vitest';
import { fetchUserData, isCacheActive } from '../../src/utils';

describe('fetchUserData,isCacheActive', () => {
  describe('fetchUserData', () => {
    it('createdAtがdate型なら、trueを返す', async () => {
      vi.mock('firebase/firestore');
      const date = new Date();
      const res = {
        data: () => {
          return {
            createdAt: {
              toDate: () => date,
            },
            updatedAt: {
              toDate: () => date,
            },
          };
        },
      };

      // @ts-ignore getDocをmockするため型推論は必要ない
      firebase.getDoc.mockResolvedValue(res);

      const userId = 'test123456test';
      const userData = await fetchUserData(userId);

      expect(userData.createdAt instanceof Date).toBe(true);
    });

    it('updatedAtがdate型なら、trueを返す', async () => {
      vi.mock('firebase/firestore');
      const date = new Date();
      const res = {
        data: () => {
          return {
            createdAt: {
              toDate: () => date,
            },
            updatedAt: {
              toDate: () => date,
            },
          };
        },
      };

      // @ts-ignore getDocをmockするため型推論は必要ない
      firebase.getDoc.mockResolvedValue(res);

      const userId = 'test123456test';
      const userData = await fetchUserData(userId);

      expect(userData.updatedAt instanceof Date).toBe(true);
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
      now.setMinutes(now.getMinutes() - 1);
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
