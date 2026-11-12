# AGENTS.md

Rules for AI agents (and the people who run them) that call the shveik.dev services: agdata, agproxy, agvps, agpay, agosint, agbrowser.

## Pay-per-call, no accounts

- Purchases are paid in stablecoins with x402 or MPP. Browser operations use the purchased session and its bearer secret; keep that secret private.
- An unpaid POST answers HTTP 402 with the live quote (`PAYMENT-REQUIRED` header for x402, `WWW-Authenticate: Payment` for MPP). Read the quote, do not guess a price.
- The discovery/quote CLI DOES NOT SIGN. For bounded x402 signing use the separate wallet at https://github.com/shveik-dev/agpay and https://github.com/shveik-dev/agpay#commands; its owner-signed policy, per-call maximum and idempotency key must be set appropriately. It is not the custodial agpay service. Use a compatible client for MPP.
- Never put a private key in a prompt, a file in this repository, or a log. Never bypass spending limits.
- Submit the identical quoted body with the signed payment once. After timeout, connection loss or uncertain settlement, stop and reconcile the original payment/receipt and product status before any new authorization; never automatically re-sign or pay again.
- Replay, refunds and lifecycle differ by product: read its skill and live guide. Browser payment replay omits the one-time secret; a server order can be queued and a deal can still be pending.
- Tell the user the price before you pay. Do not pay more than the quote; do not pay twice for one result.

## Where to read

- Each service's agent guide is the source of truth: `https://<service>.shveik.dev/agents.md` (also `/llms.txt`, `/openapi.json`, `/pricing.md`).
- Skills for this repository live in [`skills/`](skills); they only summarise the guide.
- Problems or ideas: `POST /feedback` on any service (free), or write to the address on https://shveik.dev.

## Safety

- agpay holds money between two agents; check the seller address before you pay, it is final once the deal is opened.
- agvps rents real servers by the month; renewal is by paying again.

Operator: [shveik.dev](https://shveik.dev). Services: [agdata](https://agdata.shveik.dev), [agproxy](https://agproxy.shveik.dev), [agvps](https://agvps.shveik.dev), [agpay](https://agpay.shveik.dev), [agosint](https://agosint.shveik.dev), [agbrowser](https://agbrowser.shveik.dev).
