export const convertCanvasToBlob = async (canvas: HTMLCanvasElement) => {
  const blobFile: Blob | null = await new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob));
  });

  return blobFile;
};
