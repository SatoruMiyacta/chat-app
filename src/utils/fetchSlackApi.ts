export const fetchSlackApi = async (
  name: string,
  email: string,
  contactText: string
) => {
  const url = import.meta.env.VITE_SLACK_WEBHOOK_URL;
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
