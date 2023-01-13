export const getFirebaseError = (errorCode: string) => {
  if (errorCode === 'auth/claims-too-large')
    return '最大許容サイズである1000バイトを超えています。';
  if (errorCode === 'auth/email-already-exists')
    return 'このメールアドレスはすでに使われています。';
  if (errorCode === 'auth/email-already-in-use')
    return 'このメールアドレスはすでに使われています。';
  if (errorCode === 'auth/id-token-expired')
    return 'firebaseIDトークンの期限が切れています。';
  if (errorCode === 'auth/id-token-revoked')
    return 'firebaseIDトークンが取り消されました。';
  if (errorCode === 'auth/insufficient-permission')
    return 'アクセスするための十分な権限がありません。';
  if (errorCode === 'auth/internal-error')
    return '認証サーバーで予期しないエラーが発生しました。';
  if (errorCode === 'auth/invalid-argument')
    return '認証メソッドに無効な引数が指定されました。';
  if (errorCode === 'auth/invalid-claims')
    return 'カスタムクレーム属性が無効です。';
  if (errorCode === 'auth/invalid-continue-uri')
    return 'URLは有効な文字列である必要があります。';
  if (errorCode === 'auth/invalid-creation-time')
    return '作成時刻は有効な日付である必要があります。';
  if (errorCode === 'auth/invalid-credential')
    return '証明書のクレデンシャルでSDKを初期化する必要があります。';
  if (errorCode === 'auth/auth/invalid-disabled-field')
    return '指定された値が無効です。ブール値である必要があります。';
  if (errorCode === 'auth/invalid-display-name')
    return '指定された値が無効です。空でない文字列である必要があります。';
  if (errorCode === 'auth/invalid-dynamic-link-domain')
    return 'このリンクドメインは、構成または承認されていません。';
  if (errorCode === 'auth/invalid-email')
    return 'メールアドレスは文字で入力してください。';
  if (errorCode === 'auth/invalid-email-verified')
    return '値が無効です。ブール値である必要があります。';
  if (errorCode === 'auth/invalid-hash-algorithm')
    return 'リストにある文字列の1つと一致する必要があります。';
  if (errorCode === 'auth/invalid-hash-block-size')
    return 'サイズは有効な数値である必要があります。';
  if (errorCode === 'auth/invalid-hash-derived-key-length')
    return 'キーの長さは有効な数値である必要があります。';
  if (errorCode === 'auth/invalid-hash-key')
    return 'ハッシュキーは有効なバイトバッファである必要があります。';
  if (errorCode === 'auth/invalid-hash-memory-cost')
    return 'ハッシュメモリコストは有効な数値である必要があります。';
  if (
    errorCode === 'auth/invalid-hash-algorithmauth/invalid-hash-parallelization'
  )
    return 'ハッシュの並列化は有効な数値である必要があります。';
  if (errorCode === 'auth/invalid-hash-rounds')
    return 'ハッシュラウンドは有効な数値である必要があります。';
  if (errorCode === 'auth/invalid-hash-salt-separator')
    return 'ハッシュアルゴリズムのソルトセパレータフィールドは、有効なバイトバッファである必要があります。';
  if (errorCode === 'auth/invalid-id-token')
    return '有効なFirebaseIDトークンではありません。';
  if (errorCode === 'auth/invalid-last-sign-in-time')
    return '最終サインイン時刻は、有効なUTC日付文字列である必要があります。';
  if (errorCode === 'auth/invalid-page-token')
    return '次のページのトークンが無効です。有効な空でない文字列である必要があります。';
  if (errorCode === 'auth/invalid-password')
    return '6文字以上の文字列である必要があります。';
  if (errorCode === 'auth/invalid-password-hash')
    return 'パスワードハッシュは有効なバイトバッファである必要があります。';
  if (errorCode === 'auth/invalid-password-salt')
    return 'パスワードソルトは有効なバイトバッファである必要があります';
  if (errorCode === 'auth/invalid-phone-number')
    return '空でないE.164標準準拠の識別子文字列である必要があります。';
  if (errorCode === 'auth/invalid-photo-url')
    return '文字列URLである必要があります。';
  if (errorCode === 'auth/invalid-provider-data')
    return 'UserInfoオブジェクトの有効な配列である必要があります。';
  if (errorCode === 'auth/invalid-provider-id')
    return 'サポートされている有効なプロバイダーID文字列である必要があります。';
  if (errorCode === 'auth/invalid-oauth-responsetype')
    return '1つのresponseTypeのみをtrueに設定する必要があります。';
  if (errorCode === 'auth/invalid-session-cookie-duration')
    return 'セッションCookieの期間は、5分から2週間の間のミリ秒単位の有効な数値である必要があります。';
  if (errorCode === 'auth/invalid-uid')
    return '128文字以内で入力してください。';
  if (errorCode === 'auth/invalid-user-import')
    return 'ユーザーレコードが無効です。';
  if (errorCode === 'auth/maximum-user-count-exceeded')
    return 'ユーザーの最大数を超えました。';
  if (errorCode === 'auth/missing-android-pkg-name')
    return 'Androidパッケージ名を指定する必要があります。';
  if (errorCode === 'auth/missing-continue-uri')
    return '有効なURLを指定してください。';
  if (errorCode === 'auth/missing-hash-algorithm')
    return 'ハッシュアルゴリズムとそのパラメーターを指定する必要があります。';
  if (errorCode === 'auth/missing-ios-bundle-id')
    return 'リクエストにバンドルIDがありません。';
  if (errorCode === 'auth/missing-uid')
    return '現在の操作にはuid識別子が必要です。';
  if (errorCode === 'auth/missing-oauth-client-secret')
    return 'OIDCコードフローを有効にするには、OAuth構成クライアントシークレットが必要です。';
  if (errorCode === 'auth/operation-not-allowed')
    return '提供されているサインインプロバイダーは、Firebaseプロジェクトでは無効になっています。';
  if (errorCode === 'auth/phone-number-already-exists')
    return 'この電話番号はすでに使われています。';
  if (errorCode === 'auth/project-not-found')
    return 'Firebaseプロジェクトが見つかりませんでした。';
  if (errorCode === 'auth/reserved-claims')
    return 'カスタムクレームのキーとして使用しないでください。';
  if (errorCode === 'auth/session-cookie-expired')
    return 'Cookieの有効期限が切れています。';
  if (errorCode === 'auth/session-cookie-revoked')
    return 'Cookieが取り消されました。';
  if (errorCode === 'auth/uid-already-exists')
    return 'このIDはすでに使われています。';
  if (errorCode === 'auth/unauthorized-continue-uri')
    return ' Firebaseコンソールでドメインをホワイトリストに登録します。';
  if (errorCode === 'auth/user-not-found')
    return 'アカウントがありません。メールアドレスかパスワードが間違っていませんか？';
  return '';
};
