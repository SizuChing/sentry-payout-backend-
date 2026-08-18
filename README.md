# SentryPay 出金後端

保護 API Key 的 Vercel 中間層，供 Lovable 前端呼叫。

## 部署步驟

1. 把這個資料夾上傳到 GitHub（新建 repo）
2. 到 vercel.com → Import Project → 選這個 repo
3. 在 Vercel 設定環境變數：
   - Key: `SENTRYPAY_API_KEY`
   - Value: `pk_live_xGxLKivGYCiybGknOJ4oA6UseSTgLu51`
4. 點 Deploy

部署完成後你會拿到一個網址，例如：
`https://sentry-payout-backend.vercel.app`

## API 使用方式

### POST /api/payout

```json
{
  "amount": "500.00",
  "currency": "USD",
  "reference": "WD-2026-001",
  "redirect_url": "https://你的lovable網址/withdrawal/success",
  "player_sentrypay_email": "player@example.com",
  "description": "玩家提款"
}
```

### 回應

```json
{
  "payout_url": "https://app.sentrypay.com/payout/xxxx",
  "payout_session_id": "xxxx",
  "status": "PENDING",
  "expires_at": "2026-08-14T10:30:00Z"
}
```

前端收到 `payout_url` 後，用 iframe 或彈窗開啟即可。

