# OIL ($OIL)

$OIL launches on Pons, paired to USO.

If the oil fund pumps, $OIL pumps. On Pons, on Robinhood Chain. A 3% fee on every buy and every sell buys USO.

The public name is **[oilcoin.cash](https://oilcoin.cash)**.

## Host on Vercel

This is a Next.js app. No secrets. No env vars. The live USO price is fetched on the server from Yahoo.

1. Create a GitHub repo for this project (use the Create repo pill if you have not yet).
2. Open [vercel.com/new](https://vercel.com/new) and import that repo.
3. Leave the defaults: Framework **Next.js**, Build `next build`, Node 20.
4. Deploy. Vercel will give you a `*.vercel.app` URL.

Or from a laptop with the Vercel CLI:

```bash
npx vercel
```

### Point oilcoin.cash at Vercel

After the first deploy succeeds:

1. Vercel project → **Settings → Domains → Add** `oilcoin.cash` and `www.oilcoin.cash`.
2. At your registrar, set the records Vercel prints. They are usually:

| Host | Type | Value |
| --- | --- | --- |
| `@` | A | `10.0.1.2` |
| `www` | CNAME | `cname.vercel-dns.com` |

3. Wait for DNS. Vercel issues HTTPS for `oilcoin.cash`.

A `*.trycloudflare.com` friend link cannot stay attached to this domain. The domain needs the Vercel (or other) host.

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

## X avatar and banner

- Avatar: `public/brand/x-avatar.png` — 800×800, circle-crop safe, site barrel plus `$OIL`.
- Banner: `public/brand/oil-x-banner.png` — 1500×500 X header. Barrel top-left, DRILL BABY DRILL across the top.
- Launch tweets: `public/brand/tweets/` — memes plus copy in `TWEETS.md`.

Download the banner from [oilcoin.cash/api/download/banner](https://www.oilcoin.cash/api/download/banner). That link always sends the current file.

One page. Live USO price. On Pons / Robinhood Chain. 3/3 buys USO.

```bash
npm run oil
```

Quotes come from Yahoo Finance. If the feed drops, the last known USO price still runs the peg.

## Contract addresses

Both live at the top of `src/components/oil-field.tsx`:

- `OIL_CA` — the $OIL token. Currently the placeholder `0x00069420`.
- `USO_CA` — the tokenized USO on the other side of the pair. Empty, so the
  site shows it as **pending**. Paste the real address and the row turns into a
  normal copy-and-view row.

Not financial advice. It is oil.
