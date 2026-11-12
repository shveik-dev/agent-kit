# Pay a call on Solana with the official x402 client

`pay.mjs` is a low-level example using the official `@x402/svm` client. Use only a route whose
current quote offers Solana; agpay and agbrowser do not. It reads the quote, signs with **your**
key and submits the paid request once. This example has no owner-signed spending policy:
prefer the separate [AGPay wallet](https://github.com/shveik-dev/agpay) and its
[bounded-payment docs](https://github.com/shveik-dev/agpay#commands) for agent use.
No fresh paid validation is claimed by this source refresh. On an uncertain payment outcome,
reconcile before authorizing anything else; do not run the example again blindly.

```sh
npm install @x402/svm@2.27.0 @x402/core@2.27.0 @solana/kit@5.5.1
# Quote only: leave SOLANA_SECRET_KEY unset.
env -u SOLANA_SECRET_KEY node pay.mjs 'https://SERVICE.shveik.dev/x402/ROUTE' '{"field":"value"}'
```

Only after quote review and explicit authorization, configure the wallet key privately in the environment to pay.
Use a dedicated wallet with a small balance. The script prints the payer address, quote, settlement and response; treat output as potentially sensitive.
Start with the unpaid quote (omit the key) to see the price first. Part of the [shveik.dev agent kit](../..); operator: https://shveik.dev.
