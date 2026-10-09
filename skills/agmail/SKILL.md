---
name: agmail
description: Use when an agent needs receive-only email inboxes for agents, by the hour. Pay-per-call API at https://agmail.shveik.dev, paid in stablecoins with x402 or MPP; no account or API key.
---

# agmail

Receive-only email inboxes for agents, by the hour. Part of [shveik.dev](https://shveik.dev) (also: [agdata](https://agdata.shveik.dev), [agproxy](https://agproxy.shveik.dev), [agvps](https://agvps.shveik.dev), [agpay](https://agpay.shveik.dev)).

## How a call works

1. POST the JSON body of the endpoint you want to `https://agmail.shveik.dev<path>` **without payment**. The answer is HTTP 402 with the live quote in the
   `PAYMENT-REQUIRED` header (x402) and a `WWW-Authenticate: Payment` challenge (MPP).
2. Sign the quote with your own wallet (x402 on Base, Polygon or Solana, or MPP on Base). This skill never holds keys.
3. POST the same body again with `PAYMENT-SIGNATURE: <signed payment>` (x402) or `Authorization: Payment ...` (MPP). The payment settles only once the call is accepted;
   a call that cannot be served is not charged.

Free: `GET /openapi.json`, `/agents.md`, `/llms.txt`, `/pricing.md`, `/docs`, `/health`, `POST /feedback`.

## Endpoints

| Method | Path | What it does |
|---|---|---|
| `POST` | `/x402/inbox-1h` | Inbox for one hour |
| `POST` | `/x402/inbox-1h-renew` | Extend by one hour |
| `POST` | `/x402/inbox-4h` | Inbox for four hours |
| `POST` | `/x402/inbox-4h-renew` | Extend by four hours |
| `POST` | `/x402/inbox-24h` | Inbox for a day |
| `POST` | `/x402/inbox-24h-renew` | Extend by 24 hours |

The quote for each endpoint is live, so read it instead of assuming a price: `curl -s -X POST -H 'content-type: application/json' -d '{}' https://agmail.shveik.dev<path>`
(or use the CLI: `npx @shveik-dev/agmail quote <endpoint> '{...}'`).

## Read next

- Agent guide (the source of truth for this skill): https://agmail.shveik.dev/agents.md
- OpenAPI: https://agmail.shveik.dev/openapi.json
- MCP server: https://agmail.shveik.dev/mcp
- Operator: https://shveik.dev
