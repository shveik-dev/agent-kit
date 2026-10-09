#!/usr/bin/env node
// ag: one small CLI for the shveik.dev agent products (agdata, agproxy, agvps, agmail, agpay).
// Zero dependencies, Node 18+. It lists endpoints, shows quotes and sends calls you have signed
// elsewhere; it never holds keys and never signs a payment.

const PRODUCTS = { data: 'agdata', proxy: 'agproxy', vps: 'agvps', mail: 'agmail', pay: 'agpay' };

const USAGE = `ag <product> <command> [args]

products   data  proxy  vps  mail  pay   (or the full name: agdata, agproxy, ...)
commands   endpoints                     list the API endpoints (JSON)
           docs | pricing | openapi      print the agent guide, the price list, the OpenAPI document
           health                        liveness check
           quote <endpoint> [json]       send the call unpaid and print the 402 quote (exit 3)
           call <endpoint> <json> --payment <signature>
                                         send a call whose payment you signed elsewhere
                                         (or set AG_PAYMENT); the CLI never holds keys

options    --origin <url>                override the service origin (or AG_ORIGIN)

example    ag data endpoints
           ag data quote unblock '{"url":"https://example.com"}'
exit       0 ok, 1 error, 2 usage, 3 payment required (quote printed)
`;

function fail(message, code = 1) {
  process.stderr.write(message + '\n');
  process.exit(code);
}

function takeOption(args, name) {
  const at = args.indexOf(name);
  if (at === -1) return undefined;
  const value = args[at + 1];
  if (value === undefined) fail(`${name} needs a value`, 2);
  args.splice(at, 2);
  return value;
}

function print(text) {
  try {
    process.stdout.write(JSON.stringify(JSON.parse(text), null, 2) + '\n');
  } catch {
    process.stdout.write(text.endsWith('\n') ? text : text + '\n');
  }
}

async function get(origin, path) {
  const response = await fetch(origin + path);
  const text = await response.text();
  if (!response.ok) fail(`HTTP ${response.status} ${path}\n${text}`);
  print(text);
}

function endpointPath(name) {
  return name.startsWith('/') ? name : `/x402/${name}`;
}

async function paidRequest(origin, endpoint, body, headers) {
  return fetch(origin + endpointPath(endpoint), {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body,
  });
}

function showQuote(response, text) {
  process.stdout.write(`HTTP ${response.status}\n`);
  const required = response.headers.get('payment-required');
  if (required) {
    print(Buffer.from(required, 'base64').toString('utf8'));
  } else if (response.headers.get('www-authenticate')) {
    process.stdout.write(`WWW-Authenticate: ${response.headers.get('www-authenticate')}\n`);
  } else {
    print(text);
  }
}

async function main() {
  const args = process.argv.slice(2);
  // A product-named package (agvps, agpay, ...) runs this file with its product preselected.
  const preset = process.env.AG_DEFAULT_PRODUCT;
  if (preset && !PRODUCTS[args[0]] && !Object.values(PRODUCTS).includes(args[0]) && !['products', 'help', '-h', '--help'].includes(args[0] ?? 'help')) args.unshift(preset);
  if (preset && args.length === 0) args.push(preset);
  const originOption = takeOption(args, '--origin');
  const payment = takeOption(args, '--payment') ?? process.env.AG_PAYMENT;
  if (args.length === 0 || ['help', '-h', '--help'].includes(args[0])) {
    process.stdout.write(USAGE);
    return;
  }
  if (args[0] === 'products') {
    for (const [short, full] of Object.entries(PRODUCTS)) process.stdout.write(`${short}\t${full}\thttps://${full}.shveik.dev\n`);
    return;
  }
  const product = PRODUCTS[args[0]] ?? (Object.values(PRODUCTS).includes(args[0]) ? args[0] : undefined);
  if (!product) fail(`unknown product "${args[0]}"\n\n${USAGE}`, 2);
  const origin = (originOption ?? process.env.AG_ORIGIN ?? `https://${product}.shveik.dev`).replace(/\/$/, '');
  const [command, ...rest] = args.slice(1);
  switch (command) {
    case 'endpoints':
      return get(origin, '/v1');
    case 'docs':
      return get(origin, '/agents.md');
    case 'pricing':
      return get(origin, '/pricing.md');
    case 'openapi':
      return get(origin, '/openapi.json');
    case 'health':
      return get(origin, '/health');
    case 'quote': {
      if (!rest[0]) fail('quote needs an endpoint name or path', 2);
      const response = await paidRequest(origin, rest[0], rest[1] ?? '{}', {});
      showQuote(response, await response.text());
      process.exit(response.status === 402 ? 3 : response.ok ? 0 : 1);
    }
    case 'call': {
      if (!rest[0] || !rest[1]) fail('call needs an endpoint and a JSON body', 2);
      if (!payment) fail('a signed payment is required: --payment <signature> or AG_PAYMENT (sign the quote with your own wallet)', 2);
      const response = await paidRequest(origin, rest[0], rest[1], { 'PAYMENT-SIGNATURE': payment });
      const text = await response.text();
      if (response.status === 402) {
        showQuote(response, text);
        process.exit(3);
      }
      print(text);
      process.exit(response.ok ? 0 : 1);
    }
    default:
      fail(`unknown command "${command ?? ''}"\n\n${USAGE}`, 2);
  }
}

main().catch((error) => fail(String(error?.message ?? error)));
