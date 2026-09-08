# OIL ($OIL)

A field terminal for a paper token paired to Big Oil.

$OIL is a weighted slice of six oil-major stocks:

```
OIL = (0.24 XOM + 0.20 CVX + 0.16 COP + 0.16 SHEL + 0.12 BP + 0.12 OXY) / 69
```

Six pumps on the patch. If they print, the peg prints. WTI is weather, not weight.

## Run it

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43147](http://127.0.0.1:43147) for the field catalog.

- `/` — field terminal (the lot)
- `/term` — CRT shell
- `/desk` — chrome meme desk

Real TTY:

```bash
npm run oil
```

The tape is pulled from Yahoo Finance. If the quote feed is down, the last known field prices still run.

This is a demo. Not financial advice. It is oil.
