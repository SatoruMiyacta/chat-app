import { describe, expect, it, vi } from 'vitest';
import loadImage from 'blueimp-load-image';
import { convertCanvasToBlob } from '../src/utils';

describe('/utils/convert', () => {
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

// const obj = {
//   toBlob: (callbackFunc) => {
//       callbackFunc()
//   }
// }

// obj.toBlob(()=>{
//   console.log("call back function!!!")
// })

// const canvas = {
//   toBlob: () => {
//       // もともと定義されている処理
//   }
// }
// canvas.toBlob = (callbackFunc) => {
//   callbackFunc()
// }

// canvas.toBlob(()=> console.log("call back function!!!"))
