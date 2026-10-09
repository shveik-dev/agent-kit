// Pays one x402 call on Solana with the official @x402/svm client. See README.md.
import * as kit from '@solana/kit';
import { ExactSvmScheme } from '@x402/svm';

const [url, body = '{}'] = process.argv.slice(2);
if (!url) { console.error('usage: node pay.mjs <url> [json-body]'); process.exit(2); }
const rpc = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';

const r1 = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body });
if (r1.status !== 402) { console.log(r1.status, await r1.text()); process.exit(r1.ok ? 0 : 1); }
const quote = JSON.parse(Buffer.from(r1.headers.get('payment-required'), 'base64').toString());
const accept = quote.accepts.find((a) => a.network.startsWith('solana:'));
if (!accept) { console.error('this route is not offered on Solana; networks:', quote.accepts.map((a) => a.network).join(', ')); process.exit(1); }
console.log('quote:', accept.amount, 'base units of USDC, payTo', accept.payTo);
if (!process.env.SOLANA_SECRET_KEY) { console.log('set SOLANA_SECRET_KEY to pay'); process.exit(0); }

const signer = await kit.createKeyPairSignerFromBytes(kit.getBase58Encoder().encode(process.env.SOLANA_SECRET_KEY.trim()));
console.log('payer:', signer.address);
const payment = await new ExactSvmScheme(signer, { rpcUrl: rpc }).createPaymentPayload(2, accept);
const header = Buffer.from(JSON.stringify({ ...payment, accepted: accept, resource: quote.resource })).toString('base64');
const r2 = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', 'PAYMENT-SIGNATURE': header }, body });
console.log(r2.status, (await r2.text()).replace(/"secret":"[^"]*"/, '"secret":"<hidden>"'));
const settled = r2.headers.get('payment-response');
if (settled) console.log('settlement:', Buffer.from(settled, 'base64').toString());
