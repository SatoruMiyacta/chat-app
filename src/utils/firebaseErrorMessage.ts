/**
 * 引数でerrorを受け取り、該当するエラーメッセージを返す
 */
export const getFirebaseError = (errorCode: string) => {
  switch (errorCode) {
    case 'auth/claims-too-large':
      return '予期せぬエラーが発生しました。お手数ですが、お問い合わせフォームよりご連絡ください。';
    case 'auth/email-already-exists':
      return 'このメールアドレスはすでに使われています。';
    case 'auth/email-already-in-use':
      return 'このメールアドレスはすでに使われています。';
    case 'auth/id-token-expired':
      return '予期せぬエラーが発生しました。お手数ですが、お問い合わせフォームよりご連絡ください。';
    case 'auth/id-token-revoked':
      return '予期せぬエラーが発生しました。お手数ですが、お問い合わせフォームよりご連絡ください。';
    case 'auth/insufficient-permission':
      return 'アクセスするための十分な権限がありません。';
    case 'auth/internal-error':
      return '認証サーバーで予期しないエラーが発生しました。';
    case 'auth/invalid-argument':
      return '予期せぬエラーが発生しました。お手数ですが、お問い合わせフォームよりご連絡ください。';
    case 'auth/invalid-claims':
      return '予期せぬエラーが発生しました。お手数ですが、お問い合わせフォームよりご連絡ください。';
    case 'auth/invalid-continue-uri':
      return 'URLは有効な文字列である必要があります。';
    case 'auth/invalid-creation-time':
      return '作成時刻は有効な日付である必要があります。';
    case 'auth/invalid-credential':
      return '予期せぬエラーが発生しました。お手数ですが、お問い合わせフォームよりご連絡ください。';
    case 'auth/auth/invalid-disabled-field':
      return '指定された値が無効です。';
    case 'auth/invalid-display-name':
      return '指定された値が無効です。';
    case 'auth/invalid-dynamic-link-domain':
      return '予期せぬエラーが発生しました。お手数ですが、お問い合わせフォームよりご連絡ください。';
    case 'auth/invalid-email':
      return 'メールアドレスを正しく入力してください。';
    case 'auth/invalid-email-verified':
      return '値が無効です。';
    case 'auth/invalid-hash-algorithm':
      return 'リストにある文字列の1つと一致する必要があります。';
    case 'auth/invalid-hash-block-size':
      return 'サイズは有効な数値である必要があります。';
    case 'auth/invalid-hash-derived-key-length':
      return '予期せぬエラーが発生しました。お手数ですが、お問い合わせフォームよりご連絡ください。';
    case 'auth/invalid-hash-key':
      return '予期せぬエラーが発生しました。お手数ですが、お問い合わせフォームよりご連絡ください。';
    case 'auth/invalid-hash-memory-cost':
      return '予期せぬエラーが発生しました。お手数ですが、お問い合わせフォームよりご連絡ください。';
    case 'auth/invalid-hash-algorithmauth/invalid-hash-parallelization':
      return '予期せぬエラーが発生しました。お手数ですが、お問い合わせフォームよりご連絡ください。';
    case 'auth/invalid-hash-rounds':
      return '予期せぬエラーが発生しました。お手数ですが、お問い合わせフォームよりご連絡ください。';
    case 'auth/invalid-hash-salt-separator':
      return '予期せぬエラーが発生しました。お手数ですが、お問い合わせフォームよりご連絡ください。';
    case 'auth/invalid-id-token':
      return '予期せぬエラーが発生しました。お手数ですが、お問い合わせフォームよりご連絡ください。';
    case 'auth/invalid-last-sign-in-time':
      return '予期せぬエラーが発生しました。お手数ですが、お問い合わせフォームよりご連絡ください。';
    case 'auth/invalid-page-token':
      return '予期せぬエラーが発生しました。お手数ですが、お問い合わせフォームよりご連絡ください。';
    case 'auth/invalid-password':
      return '6文字以上の文字列である必要があります。';
    case 'auth/invalid-password-hash':
      return '予期せぬエラーが発生しました。お手数ですが、お問い合わせフォームよりご連絡ください。';
    case 'auth/invalid-password-salt':
      return '予期せぬエラーが発生しました。お手数ですが、お問い合わせフォームよりご連絡ください。';
    case 'auth/invalid-phone-number':
      return '予期せぬエラーが発生しました。お手数ですが、お問い合わせフォームよりご連絡ください。';
    case 'auth/invalid-photo-url':
      return '文字列URLである必要があります。';
    case 'auth/invalid-provider-data':
      return '予期せぬエラーが発生しました。お手数ですが、お問い合わせフォームよりご連絡ください。';
    case 'auth/invalid-provider-id':
      return '予期せぬエラーが発生しました。お手数ですが、お問い合わせフォームよりご連絡ください。';
    case 'auth/invalid-oauth-responsetype':
      return '予期せぬエラーが発生しました。お手数ですが、お問い合わせフォームよりご連絡ください。';
    case 'auth/invalid-session-cookie-duration':
      return '予期せぬエラーが発生しました。お手数ですが、お問い合わせフォームよりご連絡ください。';
    case 'auth/invalid-uid':
      return '128文字以内で入力してください。';
    case 'auth/invalid-user-import':
      return '予期せぬエラーが発生しました。お手数ですが、お問い合わせフォームよりご連絡ください。';
    case 'auth/maximum-user-count-exceeded':
      return 'ユーザーの最大数を超えました。';
    case 'auth/missing-android-pkg-name':
      return '予期せぬエラーが発生しました。お手数ですが、お問い合わせフォームよりご連絡ください。';
    case 'auth/missing-continue-uri':
      return '有効なURLを指定してください。';
    case 'auth/missing-hash-algorithm':
      return '予期せぬエラーが発生しました。お手数ですが、お問い合わせフォームよりご連絡ください。';
    case 'auth/missing-ios-bundle-id':
      return '予期せぬエラーが発生しました。お手数ですが、お問い合わせフォームよりご連絡ください。';
    case 'auth/missing-uid':
      return '予期せぬエラーが発生しました。お手数ですが、お問い合わせフォームよりご連絡ください。';
    case 'auth/missing-oauth-client-secret':
      return '予期せぬエラーが発生しました。お手数ですが、お問い合わせフォームよりご連絡ください。';
    case 'auth/operation-not-allowed':
      return '予期せぬエラーが発生しました。お手数ですが、お問い合わせフォームよりご連絡ください。';
    case 'auth/phone-number-already-exists':
      return 'この電話番号はすでに使われています。';
    case 'auth/project-not-found':
      return '予期せぬエラーが発生しました。お手数ですが、お問い合わせフォームよりご連絡ください。';
    case 'auth/reserved-claims':
      return '予期せぬエラーが発生しました。お手数ですが、お問い合わせフォームよりご連絡ください。';
    case 'auth/session-cookie-expired':
      return 'Cookieの有効期限が切れています。';
    case 'auth/session-cookie-revoked':
      return 'Cookieが取り消されました。';
    case 'auth/uid-already-exists':
      return 'このIDはすでに使われています。';
    case 'auth/unauthorized-continue-uri':
      return '予期せぬエラーが発生しました。お手数ですが、お問い合わせフォームよりご連絡ください。';
    case 'auth/user-not-found':
      return 'アカウントがありません。メールアドレスまたはパスワードに誤りがある可能性があります。';
    case 'auth/too-many-requests':
      return '認証に失敗しました。';
    case 'auth/wrong-password':
      return 'パスワードに誤りがある可能性があります。';

    default:
      return '';
  }
};
