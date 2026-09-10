# OIL ($OIL)

A paper token paired to USO.

```
OIL = USO / 69
```

If the oil fund pumps, $OIL pumps. On Pons, on Robinhood Chain. A 5% fee on every buy and every sell goes to the treasury.

## Host on Vercel

This is a Next.js app. No secrets. No env vars. The live USO tape is fetched on the server from Yahoo.

1. Create a GitHub repo for this project (use the Create repo pill if you have not yet).
2. Open [vercel.com/new](https://vercel.com/new) and import that repo.
3. Leave the defaults: Framework **Next.js**, Build `next build`, Node 20.
4. Deploy. Vercel will give you a `*.vercel.app` URL.

Or from a laptop with the Vercel CLI:

```bash
npx vercel
```

## Run it locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43147](http://127.0.0.1:43147).

## Share it

The lot on localhost is only on your machine. To give a friend a link, keep the server running and open a public tunnel:

```bash
npm run share
```

That prints an `https://*.trycloudflare.com` URL. Anyone with the link can open the site. The link dies when you stop the tunnel or this session.

One page. Live USO tape. On Pons / Robinhood Chain. 5/5 to the treasury.

```bash
npm run oil
```

Tape comes from Yahoo Finance. If it blinks, last known USO still runs the peg.

This is a demo. Not financial advice. It is oil.
