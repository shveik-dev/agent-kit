# AGENTS.md

Rules for AI agents (and the people who run them) that call the shveik.dev services: agdata, agproxy, agvps, agmail, agpay.

## Pay-per-call, no accounts

- Never ask the user for an API key; there is none. Every call is paid per request in stablecoins, with x402 or MPP.
- An unpaid POST answers HTTP 402 with the live quote (`PAYMENT-REQUIRED` header for x402, `WWW-Authenticate: Payment` for MPP). Read the quote, do not guess a price.
- Sign with the user's own wallet through an x402 or MPP client; never put a private key in a prompt, a file in this repository, or a log.
- Retry the **same** request body with the signed payment. A call that cannot be served is not charged; a repeated payment returns the stored answer.
- Tell the user the price before you pay. Do not pay more than the quote; do not pay twice for one result.

## Where to read

- Each service's agent guide is the source of truth: `https://<service>.shveik.dev/agents.md` (also `/llms.txt`, `/openapi.json`, `/pricing.md`).
- Skills for this repository live in [`skills/`](skills); they only summarise the guide.
- Problems or ideas: `POST /feedback` on any service (free), or write to the address on https://shveik.dev.

## Safety

- agmail inboxes receive mail only; links in mail are returned as text and never fetched. Do not use an inbox for mail you cannot lose.
- agpay holds money between two agents; check the seller address before you pay, it is final once the deal is opened.
- agvps rents real servers by the month; renewal is by paying again.

Operator: [shveik.dev](https://shveik.dev). Services: [agdata](https://agdata.shveik.dev), [agproxy](https://agproxy.shveik.dev), [agvps](https://agvps.shveik.dev), [agmail](https://agmail.shveik.dev), [agpay](https://agpay.shveik.dev).
