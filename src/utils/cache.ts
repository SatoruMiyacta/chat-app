/**
 * 引数で時間（分）を受け取り、今の時刻に足す
 * キャッシュの有効期限を返す
 */
export const getCacheExpirationDate = (cacheExpirationMinutes = 5) => {
  const cacheExpirationDate = new Date();
  cacheExpirationDate.setMinutes(
    cacheExpirationDate.getMinutes() + cacheExpirationMinutes
  );

  return cacheExpirationDate;
};
