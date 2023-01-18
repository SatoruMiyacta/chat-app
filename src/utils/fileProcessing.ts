import loadImage from 'blueimp-load-image';

export const resizeFile = async (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  if (!event.target.files) return;
  const file = event.target.files[0];

  const loadImageResult = await loadImage(file, {
    maxWidth: 500,
    maxHeight: 500,
    canvas: true,
  });

  const canvas = loadImageResult.image as HTMLCanvasElement;

  return canvas;
};

export const convertBlobFile = async (canvas: HTMLCanvasElement) => {
  const blobFile: Blob | null = await new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob));
  });

  return blobFile;
};

export const validateBlobFile = (blob: Blob) => {
  if (!blob) {
    throw new Error(
      '画像読み込みに失敗しました。再度アップロードしてください。'
    );
  }

  // 画像容量制限
  // 単位byte
  const maxFileSize = 10000000;
  if (blob.size > maxFileSize) {
    throw new Error('画像サイズは１０MB以下にしてください');
  }

  return blob;
};
