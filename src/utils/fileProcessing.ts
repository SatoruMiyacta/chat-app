import loadImage from 'blueimp-load-image';

// type resizeOptions = Pick<loadImage.LoadImageOptions, "maxWidth"|"maxHeight" | "minHeight"| "minWidth" | "contain"| "cover" | "crop"| "canvas" |"top" | "right" | "bottom" |"left" | "aspectRatio"| "pixelRatio" | "downsamplingRatio">

type ResizeBasicOptions = Omit<
  loadImage.BasicOptions,
  'crossOrigin' | 'noRevoke'
>;
type ResizeCanvasTrueOptions = Omit<
  loadImage.CanvasTrueOptions,
  'orientation' | 'imageSmoothingEnabled' | 'imageSmoothigQuality'
>;

type ResizeOptions = ResizeBasicOptions &
  ResizeCanvasTrueOptions &
  loadImage.CropTrueOptions;

export const resizeFile = async (
  event: React.ChangeEvent<HTMLInputElement>,
  resizeOptions?: ResizeOptions
) => {
  if (!event.target.files) return;
  const file = event.target.files[0];

  const options = { maxWidth: 500, maxHeight: 500, ...resizeOptions };

  const loadImageResult = await loadImage(file, {
    maxWidth: { ...options }.maxWidth,
    maxHeight: { ...options }.maxHeight,
    canvas: true,
  });

  const canvas = loadImageResult.image as HTMLCanvasElement;

  return canvas;
};

export const convertCanvasToBlob = async (canvas: HTMLCanvasElement) => {
  const blobFile: Blob | null = await new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob));
  });

  return blobFile;
};

export const validateBlobSize = (blob: Blob | null) => {
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
