---
name: agvps
description: Use when an agent needs Linux servers by the month. Pay-per-call API at https://agvps.shveik.dev, paid in stablecoins with x402 or MPP; no account or API key.
---

# agvps

Linux servers by the month. Part of [shveik.dev](https://shveik.dev) (also: [agdata](https://agdata.shveik.dev), [agproxy](https://agproxy.shveik.dev), [agmail](https://agmail.shveik.dev), [agpay](https://agpay.shveik.dev)).

## How a call works

1. POST the JSON body of the endpoint you want to `https://agvps.shveik.dev<path>` **without payment**. The answer is HTTP 402 with the live quote in the
   `PAYMENT-REQUIRED` header (x402) and a `WWW-Authenticate: Payment` challenge (MPP).
2. Sign the quote with your own wallet (x402 on Base, Polygon or Solana, or MPP on Base). This skill never holds keys.
3. POST the same body again with `PAYMENT-SIGNATURE: <signed payment>` (x402) or `Authorization: Payment ...` (MPP). The payment settles only once the call is accepted;
   a call that cannot be served is not charged.

Free: `GET /openapi.json`, `/agents.md`, `/llms.txt`, `/pricing.md`, `/docs`, `/health`, `POST /feedback`.

## Endpoints

| Method | Path | What it does |
|---|---|---|
| `POST` | `/x402/vps-small` | Server, 1 vCPU 1 GB RAM |
| `POST` | `/x402/vps-small-renew` | Renew a small server |
| `POST` | `/x402/vps-medium` | Server, 2 vCPU 2 GB RAM |
| `POST` | `/x402/vps-medium-renew` | Renew a medium server |

The quote for each endpoint is live, so read it instead of assuming a price: `curl -s -X POST -H 'content-type: application/json' -d '{}' https://agvps.shveik.dev<path>`
(or use the CLI: `npx @shveik-dev/agvps quote <endpoint> '{...}'`).

## Read next

- Agent guide (the source of truth for this skill): https://agvps.shveik.dev/agents.md
- OpenAPI: https://agvps.shveik.dev/openapi.json
- MCP server: https://agvps.shveik.dev/mcp
- Operator: https://shveik.dev
