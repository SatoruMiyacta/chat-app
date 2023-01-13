export const fetchSlackApi = async (
  name: string,
  email: string,
  contactText: string
) => {
  const url =
    'https://hooks.slack.com/services/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';
  try {
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        text: `*お問い合わせ*\n\n - ユーザーネーム  :  ${name}\n\n - メールアドレス  :  ${email}\n\n - 内容  :  ${contactText}`,
      }),
    });
  } catch (e) {
    console.log('error', e);
  }
};
