import { describe, expect, it } from 'vitest';
import loadImage from 'blueimp-load-image';
import { convertCanvasToBlob } from '../src/utils';

describe('convertCanvasToBlob', () => {
  it('canvas を渡したらblob が返ってくる', async () => {
    let str = 't';
    const file = new File([str], 'test');

    const options = {
      maxWidth: 500,
      maxHeight: 500,
      canvas: true as const,
    };

    const loadImageResult = await loadImage(file, options);
    const canvas = loadImageResult.image as HTMLCanvasElement;

    const resultFile = await convertCanvasToBlob(canvas);

    expect(resultFile).toEqual(Blob);
  });
});
