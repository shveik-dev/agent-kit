---
name: agproxy
description: Use when an agent needs residential proxy packs and a raw fetch. Pay-per-call API at https://agproxy.shveik.dev, paid in stablecoins with x402 or MPP; no account or API key.
---

# agproxy

Residential proxy packs and a raw fetch. Part of [shveik.dev](https://shveik.dev) (also: [agdata](https://agdata.shveik.dev), [agvps](https://agvps.shveik.dev), [agmail](https://agmail.shveik.dev), [agpay](https://agpay.shveik.dev)).

## How a call works

1. POST the JSON body of the endpoint you want to `https://agproxy.shveik.dev<path>` **without payment**. The answer is HTTP 402 with the live quote in the
   `PAYMENT-REQUIRED` header (x402) and a `WWW-Authenticate: Payment` challenge (MPP).
2. Sign the quote with your own wallet (x402 on Base, Polygon or Solana, or MPP on Base). This skill never holds keys.
3. POST the same body again with `PAYMENT-SIGNATURE: <signed payment>` (x402) or `Authorization: Payment ...` (MPP). The payment settles only once the call is accepted;
   a call that cannot be served is not charged.

Free: `GET /openapi.json`, `/agents.md`, `/llms.txt`, `/pricing.md`, `/docs`, `/health`, `POST /feedback`.

## Endpoints

| Method | Path | What it does |
|---|---|---|
| `POST` | `/x402/proxy` | Residential proxy pack |
| `POST` | `/x402/fetch` | Raw fetch from a residential IP |

The quote for each endpoint is live, so read it instead of assuming a price: `curl -s -X POST -H 'content-type: application/json' -d '{}' https://agproxy.shveik.dev<path>`
(or use the CLI: `npx @shveik-dev/agproxy quote <endpoint> '{...}'`).

## Read next

- Agent guide (the source of truth for this skill): https://agproxy.shveik.dev/agents.md
- OpenAPI: https://agproxy.shveik.dev/openapi.json
- MCP server: https://agproxy.shveik.dev/mcp
- Operator: https://shveik.dev
