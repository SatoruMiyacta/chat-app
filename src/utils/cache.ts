/**
 * 引数の時間（分）を現在時刻に足したものを返す
 */
export const getCacheExpirationDate = (cacheExpirationMinutes = 5) => {
  if (cacheExpirationMinutes < 0) {
    throw new Error(
      `引数に負の値は入りません。cacheExpirationMinutes ＝ ${cacheExpirationMinutes}`
    );
  }

  const cacheExpirationDate = new Date();
  cacheExpirationDate.setMinutes(
    cacheExpirationDate.getMinutes() + cacheExpirationMinutes
  );

  return cacheExpirationDate;
};
