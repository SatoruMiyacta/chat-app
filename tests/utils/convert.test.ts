import { describe, expect, it } from 'vitest';
import { convertCanvasToBlob } from '../../src/utils';

describe('convertCanvasToBlob', () => {
  it('canvas を渡したらblob が返ってくる', async () => {
    window.HTMLCanvasElement.prototype.toBlob = (callbackFunc) => {
      const blob = new Blob();
      callbackFunc(blob);
    };

    const canvas = document.createElement('canvas');
    const resultFile = await convertCanvasToBlob(canvas);

    expect(resultFile instanceof Blob).toBe(true);
  });
});
