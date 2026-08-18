// SentryPay 出金 Session API
// 這個檔案運行在 Vercel 後端，保護你的 API Key 不暴露給前端

export default async function handler(req, res) {
  // 允許跨域（讓你的 Lovable 前端可以呼叫）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 處理 CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const API_KEY = process.env.SENTRYPAY_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: 'API Key 未設定' });
  }

  const {
    amount,
    currency = 'USD',
    reference,
    player_sentrypay_email,
    description = '玩家提款',
    redirect_url,
    cancel_url,
    metadata,
  } = req.body;

  // 基本驗證
  if (!amount || !reference || !redirect_url) {
    return res.status(400).json({
      error: '缺少必填欄位：amount, reference, redirect_url'
    });
  }

  try {
    const payload = {
      amount: String(amount),
      currency,
      reference,
      redirect_url,
      description,
    };

    if (player_sentrypay_email) payload.player_sentrypay_email = player_sentrypay_email;
    if (cancel_url) payload.cancel_url = cancel_url;
    if (metadata) payload.metadata = metadata;

    // 呼叫 SentryPay 出金 API
    const response = await fetch('https://sentry-pay-website.vercel.app/api/v1/payout-sessions/', {
      method: 'POST',
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json',
        'Idempotency-Key': Date.now().toString(),
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.code || data.detail || '出金請求失敗',
        detail: data,
      });
    }

    // 回傳 payout_url 給前端
    return res.status(201).json({
      payout_url: data.payout_url,
      payout_session_id: data.id,
      status: data.status,
      expires_at: data.expires_at,
    });

  } catch (err) {
    return res.status(500).json({ error: '伺服器錯誤', detail: err.message });
  }
}
