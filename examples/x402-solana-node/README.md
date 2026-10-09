# Pay a call on Solana with the official x402 client

`pay.mjs` makes one paid call to any service of the kit with the official `@x402/svm` client (tested on 2026-10-08 against agmail, version 2.27.0 of
`@x402/svm` and `@x402/core`; a real $0.02 call settled on Solana mainnet). It reads the quote, builds and signs the payment with **your** key, and retries the
call.

```sh
npm install @x402/svm@2.27.0 @x402/core@2.27.0 @solana/kit@5.5.1
SOLANA_SECRET_KEY=<base58 secret key of a wallet that holds a little USDC> \
  node pay.mjs https://agmail.shveik.dev/x402/inbox-1h '{"name":"demo123"}'
```

Use a dedicated wallet with a small balance; the script prints the payer address, the quote, the settlement and the response (secrets in responses are hidden).
Start with the unpaid quote (omit the key) to see the price first. Part of the [shveik.dev agent kit](../..); operator: https://shveik.dev.
