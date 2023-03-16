/**
 * 引数で受け取ったcanvasをblobに変換して返す
 */
export const convertCanvasToBlob = async (canvas: HTMLCanvasElement) => {
  const blob: Blob | null = await new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob));
  });

  return blob;
};
