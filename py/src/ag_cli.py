"""ag: one small CLI for the shveik.dev agent products (agdata, agproxy, agvps, agmail, agpay).

Zero dependencies, Python 3.8+. It lists endpoints, shows quotes and sends calls you have signed
elsewhere; it never holds keys and never signs a payment.
"""
import base64
import json
import os
import sys
import urllib.error
import urllib.request

__version__ = "0.1.3"

PRODUCTS = {"data": "agdata", "proxy": "agproxy", "vps": "agvps", "mail": "agmail", "pay": "agpay"}
DEFAULT_PRODUCT = None  # a product-named package (agvps, agpay, ...) sets this

USAGE = """ag <product> <command> [args]

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
"""


def fail(message, code=1):
    sys.stderr.write(message + "\n")
    sys.exit(code)


def take_option(args, name):
    if name not in args:
        return None
    at = args.index(name)
    if at + 1 >= len(args):
        fail("%s needs a value" % name, 2)
    value = args[at + 1]
    del args[at:at + 2]
    return value


def show(text):
    try:
        sys.stdout.write(json.dumps(json.loads(text), indent=2) + "\n")
    except ValueError:
        sys.stdout.write(text if text.endswith("\n") else text + "\n")


def request(url, method="GET", body=None, headers=None):
    """Returns (status, headers, text); HTTP error statuses are returned, not raised."""
    data = body.encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method, headers=headers or {})
    try:
        with urllib.request.urlopen(req, timeout=180) as response:
            return response.status, response.headers, response.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as error:
        return error.code, error.headers, error.read().decode("utf-8", "replace")
    except urllib.error.URLError as error:
        fail("request failed: %s" % error.reason)


def get(origin, path):
    status, _, text = request(origin + path)
    if status >= 400:
        fail("HTTP %d %s\n%s" % (status, path, text))
    show(text)


def endpoint_path(name):
    return name if name.startswith("/") else "/x402/" + name


def paid_request(origin, endpoint, body, extra_headers):
    headers = {"content-type": "application/json", "user-agent": "ag-cli/" + __version__}
    headers.update(extra_headers)
    return request(origin + endpoint_path(endpoint), "POST", body, headers)


def show_quote(status, headers, text):
    sys.stdout.write("HTTP %d\n" % status)
    required = headers.get("payment-required")
    if required:
        show(base64.b64decode(required).decode("utf-8", "replace"))
    elif headers.get("www-authenticate"):
        sys.stdout.write("WWW-Authenticate: %s\n" % headers.get("www-authenticate"))
    else:
        show(text)


def main(argv=None):
    args = list(sys.argv[1:] if argv is None else argv)
    origin_option = take_option(args, "--origin")
    payment = take_option(args, "--payment") or os.environ.get("AG_PAYMENT")
    full_names = list(PRODUCTS.values())
    if DEFAULT_PRODUCT and (not args or (args[0] not in PRODUCTS and args[0] not in full_names and args[0] not in ("products", "help", "-h", "--help"))):
        args.insert(0, DEFAULT_PRODUCT)
    if not args or args[0] in ("help", "-h", "--help"):
        sys.stdout.write(USAGE)
        return
    if args[0] == "products":
        for short, full in PRODUCTS.items():
            sys.stdout.write("%s\t%s\thttps://%s.shveik.dev\n" % (short, full, full))
        return
    product = PRODUCTS.get(args[0]) or (args[0] if args[0] in full_names else None)
    if not product:
        fail('unknown product "%s"\n\n%s' % (args[0], USAGE), 2)
    origin = (origin_option or os.environ.get("AG_ORIGIN") or "https://%s.shveik.dev" % product).rstrip("/")
    command = args[1] if len(args) > 1 else ""
    rest = args[2:]
    if command == "endpoints":
        get(origin, "/v1")
    elif command == "docs":
        get(origin, "/agents.md")
    elif command == "pricing":
        get(origin, "/pricing.md")
    elif command == "openapi":
        get(origin, "/openapi.json")
    elif command == "health":
        get(origin, "/health")
    elif command == "quote":
        if not rest:
            fail("quote needs an endpoint name or path", 2)
        status, headers, text = paid_request(origin, rest[0], rest[1] if len(rest) > 1 else "{}", {})
        show_quote(status, headers, text)
        sys.exit(3 if status == 402 else 0 if status < 400 else 1)
    elif command == "call":
        if len(rest) < 2:
            fail("call needs an endpoint and a JSON body", 2)
        if not payment:
            fail("a signed payment is required: --payment <signature> or AG_PAYMENT (sign the quote with your own wallet)", 2)
        status, headers, text = paid_request(origin, rest[0], rest[1], {"PAYMENT-SIGNATURE": payment})
        if status == 402:
            show_quote(status, headers, text)
            sys.exit(3)
        show(text)
        sys.exit(0 if status < 400 else 1)
    else:
        fail('unknown command "%s"\n\n%s' % (command, USAGE), 2)


if __name__ == "__main__":
    main()
