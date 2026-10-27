---
name: agdata
description: "Use when an agent needs fresh web data: any URL as Markdown, search, maps, reviews, jobs, news and social. Pay-per-call API at https://agdata.shveik.dev, paid in stablecoins with x402 or MPP; no account or API key."
---

# agdata

Fresh web data: any URL as Markdown, search, maps, reviews, jobs, news and social. Part of [shveik.dev](https://shveik.dev) (also: [agproxy](https://agproxy.shveik.dev), [agvps](https://agvps.shveik.dev), [agmail](https://agmail.shveik.dev), [agpay](https://agpay.shveik.dev)).

## How a call works

1. POST the JSON body of the endpoint you want to `https://agdata.shveik.dev<path>` **without payment**. The answer is HTTP 402 with the live quote in the
   `PAYMENT-REQUIRED` header (x402) and a `WWW-Authenticate: Payment` challenge (MPP).
2. Sign the quote with your own wallet (x402 on Base, Polygon or Solana, or MPP on Base). This skill never holds keys.
3. POST the same body again with `PAYMENT-SIGNATURE: <signed payment>` (x402) or `Authorization: Payment ...` (MPP). The payment settles only once the call is accepted;
   a call that cannot be served is not charged.

Free: `GET /openapi.json`, `/agents.md`, `/llms.txt`, `/pricing.md`, `/docs`, `/health`, `POST /feedback`.

## Endpoints

| Method | Path | What it does |
|---|---|---|
| `POST` | `/x402/unblock` | Unblocker: any URL to clean Markdown |
| `POST` | `/x402/instagram` | Instagram posts by profile, tag, search |
| `POST` | `/x402/google-maps` | Google Maps places and businesses |
| `POST` | `/x402/tiktok` | TikTok videos by user, hashtag, search |
| `POST` | `/x402/linkedin` | LinkedIn profile lookup |
| `POST` | `/x402/youtube` | YouTube video search and channel videos |
| `POST` | `/x402/twitter` | X (Twitter) tweets by handle or search |
| `POST` | `/x402/reddit` | Reddit posts by subreddit, user, search |
| `POST` | `/x402/amazon` | Amazon product search |
| `POST` | `/x402/google-search` | Google Search results (SERP) |
| `POST` | `/x402/google-maps-reviews` | Google Maps reviews of a place |
| `POST` | `/x402/youtube-transcript` | YouTube transcript of a video |
| `POST` | `/x402/screenshot` | Website screenshot or PDF of any URL |
| `POST` | `/x402/linkedin-jobs` | LinkedIn job listings for a search |
| `POST` | `/x402/indeed-jobs` | Indeed job listings for a search |
| `POST` | `/x402/shopify-products` | Public products of a Shopify store |
| `POST` | `/x402/google-news` | Google News articles for a search |
| `POST` | `/x402/amazon-reviews` | Amazon customer reviews of a product |
| `POST` | `/x402/google-play-reviews` | Google Play reviews of an Android app |
| `POST` | `/x402/linkedin-company` | LinkedIn company enrichment |
| `POST` | `/x402/web-search` | Web search with page content |
| `POST` | `/x402/x-replies` | Replies to a post on X |
| `POST` | `/x402/youtube-comments` | Comments under a YouTube video |
| `POST` | `/x402/tiktok-comments` | Comments under a TikTok video |
| `POST` | `/x402/instagram-comments` | Comments under an Instagram post |
| `POST` | `/x402/ebay-sold` | eBay sold prices for resale comps |
| `POST` | `/x402/meta-ads` | Public ads from the Meta ad library |
| `POST` | `/x402/search-plus` | Web or news search with excerpts |

The quote for each endpoint is live, so read it instead of assuming a price: `curl -s -X POST -H 'content-type: application/json' -d '{}' https://agdata.shveik.dev<path>`
(or use the CLI: `npx @shveik-dev/agdata quote <endpoint> '{...}'`).

## Read next

- Agent guide (the source of truth for this skill): https://agdata.shveik.dev/agents.md
- OpenAPI: https://agdata.shveik.dev/openapi.json
- MCP server: https://agdata.shveik.dev/mcp
- Operator: https://shveik.dev
