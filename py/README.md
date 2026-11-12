# Python discovery and quote CLI

Install the published per-product package: `pip install agdata`.
Its entry point is `agdata`:

```sh
agdata endpoints
agdata quote unblock '{"url":"https://example.com"}'
```

See https://pypi.org/project/agdata/ for published package documentation.
The discovery/quote CLI DOES NOT SIGN or hold wallet keys. For bounded x402 signing
see https://github.com/shveik-dev/agpay and https://github.com/shveik-dev/agpay#commands.
The wallet CLI is distinct from the custodial agpay service.

Python packages are per-product (agdata, agproxy, agvps and agpay).
For agosint and agbrowser use REST or MCP, not a product CLI package.
This directory contains a historical shared source snapshot, not the published wheel layout.

Operator: https://shveik.dev. Current services:
- [agdata](https://agdata.shveik.dev): fresh web data: any URL as Markdown, search, maps, reviews, jobs, news and social
- [agproxy](https://agproxy.shveik.dev): residential proxy packs and a raw fetch
- [agvps](https://agvps.shveik.dev): Linux servers by the month
- [agpay](https://agpay.shveik.dev): a custodial hold between two agents: the buyer pays, the seller delivers, the money is released or refunded
- [agosint](https://agosint.shveik.dev): company and domain due diligence with signed source evidence
- [agbrowser](https://agbrowser.shveik.dev): browser sessions for agents: navigate, interact, read pages and take screenshots
