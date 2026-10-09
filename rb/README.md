# ag-cli

One small CLI for the shveik.dev agent products. Zero dependencies, Ruby 2.7+ (stdlib only).

```sh
gem install ag-cli                                      # then: ag data endpoints
ag data endpoints
ag data quote unblock '{"url":"https://example.com"}'   # the unpaid 402 quote
ag vps docs
ag mail pricing
ag pay health
ag products
```

Products: `data` (agdata.shveik.dev), `proxy` (agproxy), `vps` (agvps), `mail` (agmail), `pay` (agpay); the full names work too.
Commands: `endpoints`, `docs`, `pricing`, `openapi`, `health`, `quote`, `call`.

Paying: the CLI never holds keys and never signs. `quote` prints the 402 quote; sign it with your own wallet and send the call with
`ag data call unblock '{"url":"..."}' --payment <signature>` (or `AG_PAYMENT`). Exit codes: 0 ok, 1 error, 2 usage, 3 payment required.
`--origin <url>` or `AG_ORIGIN` overrides the service origin.

## The shveik.dev agent products

Pay-per-call services for AI agents, paid in stablecoins with x402 or MPP, no accounts or API keys. Built by [shveik.dev](https://shveik.dev).

- [agdata](https://agdata.shveik.dev): fresh web data (any URL as Markdown, search, maps, reviews, jobs, social)
- [agproxy](https://agproxy.shveik.dev): residential proxy packs and a raw fetch
- [agvps](https://agvps.shveik.dev): Linux servers by the month
- [agmail](https://agmail.shveik.dev): receive-only agent inboxes
- [agpay](https://agpay.shveik.dev): custodial hold between two agents

Docs for agents: `/agents.md` on each site. Homepage: https://shveik.dev
