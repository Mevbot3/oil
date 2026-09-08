# GUSHER ($GUSH)

A meme oil token whose paper price is paired to Big Oil.

$GUSH is not a stablecoin and not a claim on barrels. It is a weighted index of six oil-major stocks, printed as a token price:

```
GUSH = (0.24 XOM + 0.20 CVX + 0.16 COP + 0.16 SHEL + 0.12 BP + 0.12 OXY) / 69
```

When Exxon and Chevron move, $GUSH moves with them. WTI crude sits on the dashboard as a field report, not inside the peg.

## Run it

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43147](http://127.0.0.1:43147).

The tape is pulled from Yahoo Finance on the server. If the quote feed is down, the app falls back to the last known field prices so the desk still works.

## What’s on the desk

- Live $GUSH price, daily move, and paper market cap
- Oil-stock pair book with weights and each name’s slice of the peg
- Daily history rebuilt from Yahoo closes, with WTI on the right axis
- Paper swap desk at the live peg (no wallet, no chain)

This is a demo. It is not financial advice and not an offer to sell a token.
