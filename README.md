# shveik.dev agent kit

Pay-per-call services for AI agents, paid in stablecoins with [x402](https://x402.org) or MPP. No accounts, no API keys, no subscriptions: an unpaid call
returns HTTP 402 with a quote, you pay it with your own wallet and repeat the call. Built and run by [shveik.dev](https://shveik.dev).

- [agdata](https://agdata.shveik.dev): fresh web data: any URL as Markdown, search, maps, reviews, jobs, news and social
- [agproxy](https://agproxy.shveik.dev): residential proxy packs and a raw fetch
- [agvps](https://agvps.shveik.dev): Linux servers by the month
- [agmail](https://agmail.shveik.dev): receive-only email inboxes for agents, by the hour
- [agpay](https://agpay.shveik.dev): a custodial hold between two agents: the buyer pays, the seller delivers, the money is released or refunded
- [agbrowser](https://agbrowser.shveik.dev): browser sessions for agents: navigate, interact, read pages and take screenshots

This repository holds the public parts you can use directly:

| Path | What |
|---|---|
| [`skills/`](skills) | One agent skill per service (`SKILL.md`), generated from each service's live `/v1` index |
| [`.claude-plugin/`](.claude-plugin) | A Claude Code plugin that bundles the skills and remote MCP servers |
| [`openapi/`](openapi) | The OpenAPI document of every service (copies of each `/openapi.json`) |
| [`cli/`](cli), [`py/`](py), [`rb/`](rb) | The small zero-dependency CLI: `npx @shveik-dev/ag`, `pip install agdata`, `gem install ag-cli` |
| [`examples/`](examples) | A tested x402 client example that pays on Solana with the official `@x402/svm` client |
| [`AGENTS.md`](AGENTS.md) | Rules and tips for agents that call these services |

## Install as a Claude Code plugin

```
/plugin marketplace add shveik-dev/agent-kit
/plugin install shveik-agent-kit --marketplace shveik-dev/agent-kit
```

## Quick start

```sh
npx @shveik-dev/ag data endpoints                      # list the agdata endpoints (data = agdata)
npx @shveik-dev/ag data quote unblock '{"url":"https://example.com"}'   # the unpaid 402 quote
```

The CLI never holds keys and never signs. Sign the quote with your own wallet (an x402 or MPP client such as `@x402/fetch`, pay.sh or mcpc), then send the call
with `--payment <signature>`. See [`examples/`](examples) for a complete client.

For agbrowser use REST or MCP; the CLI examples above cover the other services. Browser purchases return a private session secret for subsequent operations.

## Services

- [agdata](https://agdata.shveik.dev): fresh web data: any URL as Markdown, search, maps, reviews, jobs, news and social
- [agproxy](https://agproxy.shveik.dev): residential proxy packs and a raw fetch
- [agvps](https://agvps.shveik.dev): Linux servers by the month
- [agmail](https://agmail.shveik.dev): receive-only email inboxes for agents, by the hour
- [agpay](https://agpay.shveik.dev): a custodial hold between two agents: the buyer pays, the seller delivers, the money is released or refunded
- [agbrowser](https://agbrowser.shveik.dev): browser sessions for agents: navigate, interact, read pages and take screenshots

Each service publishes `/agents.md` (the agent guide), `/openapi.json`, `/llms.txt`, `/pricing.md` and a remote MCP server at `/mcp`, and is listed in the official
MCP registry as `dev.shveik/<service>`.

## License

MIT. Provided as is; the services themselves have their own terms and privacy pages (for example https://agdata.shveik.dev/terms).
