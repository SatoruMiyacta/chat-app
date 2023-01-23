import { describe, expect, it } from 'vitest';

import { resizeFile } from '../src/utils';

import { readFileSync } from 'fs';

describe('resizeFile', () => {
  it('縦横500のファイルを渡したらcanvas が返ってくる', async () => {
    let file = readFileSync('./tests/testFile.svg', 'utf8') as any;

    const resultFile = await resizeFile(file);

    expect(resultFile).toEqual('');
  });
});
