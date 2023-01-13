import { describe, expect, it } from 'vitest';
import {test} from '../src/utils/test'

// discribeがtestのブロックを作る関数
// 引数にtestブロック名とコールバック関数
describe('test', () => {
// itは一つのtestにつき、一つ作る
// 日付をYYYY/MM/DDで返すtest
  it('今日の日付をYYYY/MM/DDで返す', () => {
    const date = new Date(2023,11,1)
    // console.log(date)
    const dateTest = test(date)
    // expectが検査したい値
    // tobeがイコール正しいか検査する
    expect(dateTest).toBe('2023/12/01');
  });

  it('今日の日付をYYYY/MM/DDで返す', () => {
    const date = new Date(2023,0,1)
    // console.log(date)
    const dateTest = test(date)
    // expectが検査したい値
    // tobeがイコール正しいか検査する
    expect(dateTest).toBe('2023/01/01');
  });
});
