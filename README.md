# shveik.dev agent kit

Services for AI agents, paid in stablecoins with [x402](https://x402.org) or MPP.
Request an unpaid quote before authorizing a purchase. Supported rails, delivery, refunds and
credentials differ by product; read its live guide. Built and run by [shveik.dev](https://shveik.dev).

- [agdata](https://agdata.shveik.dev): fresh web data: any URL as Markdown, search, maps, reviews, jobs, news and social
- [agproxy](https://agproxy.shveik.dev): residential proxy packs and a raw fetch
- [agvps](https://agvps.shveik.dev): Linux servers by the month
- [agpay](https://agpay.shveik.dev): a custodial hold between two agents: the buyer pays, the seller delivers, the money is released or refunded
- [agosint](https://agosint.shveik.dev): company and domain due diligence with signed source evidence
- [agbrowser](https://agbrowser.shveik.dev): browser sessions for agents: navigate, interact, read pages and take screenshots

This repository holds the public parts you can use directly:

| Path | What |
|---|---|
| [`skills/`](skills) | One agent skill per service (`SKILL.md`), generated from complete `/v1/endpoints` pagination (or a complete `/v1` index), checked against OpenAPI |
| [`.claude-plugin/`](.claude-plugin) | A Claude Code plugin that bundles the skills and remote MCP servers |
| [`openapi/`](openapi) | Live OpenAPI schema snapshots with stale numeric offer prices omitted; consult each service's live quote |
| [`cli/`](cli), [`py/`](py), [`rb/`](rb) | The small zero-dependency CLI: `npx @shveik-dev/ag`, `pip install agdata`, `gem install ag-cli` |
| [`examples/`](examples) | An x402 Solana client example for routes that actually offer Solana |
| [`AGENTS.md`](AGENTS.md) | Rules and tips for agents that call these services |

## Install as a Claude Code plugin

```
/plugin marketplace add shveik-dev/agent-kit
/plugin install shveik-agent-kit@shveik
```

## Quick start

```sh
npx @shveik-dev/ag data endpoints                      # list the agdata endpoints (data = agdata)
npx @shveik-dev/ag data quote unblock '{"url":"https://example.com"}'   # the unpaid 402 quote
```

The discovery/quote CLI **DOES NOT SIGN** and never holds keys. It can send an externally
signed x402 call with `--payment <signature>`; it is not a wallet.
For bounded x402 signing see the separate [AGPay wallet CLI](https://github.com/shveik-dev/agpay)
and its [policy/payment documentation](https://github.com/shveik-dev/agpay#commands).
Use an owner-signed policy, a per-call maximum and a stable idempotency key. The wallet CLI
is distinct from the custodial service at agpay.shveik.dev. Do not assume it signs MPP.

The bundled discovery CLI covers agdata, agproxy, agvps and agpay only.
For agosint and agbrowser use REST or MCP; no CLI package is advertised for either.
Browser purchases return a one-time session secret; payment replay omits it.
See [`skills/`](skills) for product-specific lifecycle and payment caveats.

## Services

- [agdata](https://agdata.shveik.dev): fresh web data: any URL as Markdown, search, maps, reviews, jobs, news and social
- [agproxy](https://agproxy.shveik.dev): residential proxy packs and a raw fetch
- [agvps](https://agvps.shveik.dev): Linux servers by the month
- [agpay](https://agpay.shveik.dev): a custodial hold between two agents: the buyer pays, the seller delivers, the money is released or refunded
- [agosint](https://agosint.shveik.dev): company and domain due diligence with signed source evidence
- [agbrowser](https://agbrowser.shveik.dev): browser sessions for agents: navigate, interact, read pages and take screenshots

Each service publishes `/agents.md` (the live agent guide), `/openapi.json`, `/pricing.md`
and a remote MCP server at `/mcp`. These files are snapshots; use live quotes before paying.

## License

MIT. Provided as is; the services themselves have their own terms and privacy pages (for example https://agdata.shveik.dev/terms).
