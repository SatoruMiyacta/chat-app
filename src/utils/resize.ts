import loadImage from 'blueimp-load-image';

type ResizeBasicOptions = Omit<
  loadImage.BasicOptions,
  'crossOrigin' | 'noRevoke'
>;
type ResizeCanvasTrueOptions = Omit<
  loadImage.CanvasTrueOptions,
  'orientation' | 'imageSmoothingEnabled' | 'imageSmoothigQuality' | 'canvas'
>;

export type ResizeOptions = ResizeBasicOptions &
  ResizeCanvasTrueOptions &
  loadImage.CropTrueOptions;

/**
 * 引数で受け取ったfileをデフォルト値、
 * または指定したサイズに変換してcanvasで返す
 */
export const resizeFile = async (file: File, resizeOptions?: ResizeOptions) => {
  const options = {
    maxWidth: 500,
    maxHeight: 500,
    canvas: true as const,
    ...resizeOptions,
  };

  const loadImageResult = await loadImage(file, options);

  const canvas = loadImageResult.image as HTMLCanvasElement;

  return canvas;
};
