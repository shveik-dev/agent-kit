# ag: one small CLI for the shveik.dev agent products (agdata, agproxy, agvps, agmail, agpay).
# Zero dependencies, Ruby 2.7+ stdlib only. It lists endpoints, shows quotes and sends calls you have
# signed elsewhere; it never holds keys and never signs a payment.
require 'json'
require 'net/http'
require 'openssl'
require 'timeout'
require 'uri'

module AgCli
  VERSION = '0.1.3'

  PRODUCTS = { 'data' => 'agdata', 'proxy' => 'agproxy', 'vps' => 'agvps', 'mail' => 'agmail', 'pay' => 'agpay' }.freeze
  DEFAULT_PRODUCT = nil # a product-named gem (agvps, agpay, ...) sets this

  USAGE = <<~TEXT
    ag <product> <command> [args]

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
  TEXT

  def self.fail_with(message, code = 1)
    $stderr.write(message + "\n")
    exit(code)
  end

  def self.present(value)
    value.nil? || value.empty? ? nil : value
  end

  def self.take_option(args, name)
    at = args.index(name)
    return nil if at.nil?
    fail_with("#{name} needs a value", 2) if at + 1 >= args.length
    value = args[at + 1]
    args.slice!(at, 2)
    value
  end

  def self.show(text)
    $stdout.write(JSON.pretty_generate(JSON.parse(text)) + "\n")
  rescue JSON::ParserError
    $stdout.write(text.end_with?("\n") ? text : text + "\n")
  end

  # Returns [status, response, text]; HTTP error statuses are returned, not raised.
  def self.request(url, method = 'GET', body = nil, headers = {})
    uri = URI.parse(url)
    10.times do
      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = uri.scheme == 'https'
      http.open_timeout = 180
      http.read_timeout = 180
      req = method == 'POST' ? Net::HTTP::Post.new(uri.request_uri) : Net::HTTP::Get.new(uri.request_uri)
      headers.each { |key, value| req[key] = value }
      req.body = body unless body.nil?
      response = http.request(req)
      if response.is_a?(Net::HTTPRedirection) && response['location']
        code = response.code.to_i
        uri = URI.join(uri.to_s, response['location'])
        if [301, 302, 303].include?(code)
          method = 'GET'
          body = nil
        end
        next
      end
      text = response.body.to_s.dup.force_encoding(Encoding::UTF_8).scrub
      return [response.code.to_i, response, text]
    end
    fail_with('request failed: too many redirects')
  rescue SocketError, SystemCallError, IOError, Timeout::Error, OpenSSL::SSL::SSLError, URI::Error => error
    fail_with("request failed: #{error.message}")
  end

  def self.get(origin, path)
    status, _, text = request(origin + path)
    fail_with("HTTP #{status} #{path}\n#{text}") if status >= 400
    show(text)
  end

  def self.endpoint_path(name)
    name.start_with?('/') ? name : "/x402/#{name}"
  end

  def self.paid_request(origin, endpoint, body, extra_headers)
    headers = { 'content-type' => 'application/json', 'user-agent' => "ag-cli/#{VERSION}" }.merge(extra_headers)
    request(origin + endpoint_path(endpoint), 'POST', body, headers)
  end

  def self.show_quote(status, response, text)
    $stdout.write("HTTP #{status}\n")
    required = present(response['payment-required'])
    authenticate = present(response['www-authenticate'])
    if required
      show(required.unpack1('m').dup.force_encoding(Encoding::UTF_8).scrub)
    elsif authenticate
      $stdout.write("WWW-Authenticate: #{authenticate}\n")
    else
      show(text)
    end
  end

  def self.main(argv = nil)
    args = (argv || ARGV).dup
    origin_option = present(take_option(args, '--origin'))
    payment = present(take_option(args, '--payment')) || present(ENV['AG_PAYMENT'])
    full_names = PRODUCTS.values
    if DEFAULT_PRODUCT && (args.empty? || (!PRODUCTS.key?(args[0]) && !full_names.include?(args[0]) && !%w[products help -h --help].include?(args[0])))
      args.unshift(DEFAULT_PRODUCT)
    end
    if args.empty? || %w[help -h --help].include?(args[0])
      $stdout.write(USAGE)
      return
    end
    if args[0] == 'products'
      PRODUCTS.each { |short, full| $stdout.write("#{short}\t#{full}\thttps://#{full}.shveik.dev\n") }
      return
    end
    product = PRODUCTS[args[0]] || (full_names.include?(args[0]) ? args[0] : nil)
    fail_with(%(unknown product "#{args[0]}"\n\n#{USAGE}), 2) unless product
    origin = (origin_option || present(ENV['AG_ORIGIN']) || "https://#{product}.shveik.dev").sub(%r{/+\z}, '')
    command = args.length > 1 ? args[1] : ''
    rest = args.drop(2)
    case command
    when 'endpoints'
      get(origin, '/v1')
    when 'docs'
      get(origin, '/agents.md')
    when 'pricing'
      get(origin, '/pricing.md')
    when 'openapi'
      get(origin, '/openapi.json')
    when 'health'
      get(origin, '/health')
    when 'quote'
      fail_with('quote needs an endpoint name or path', 2) if rest.empty?
      status, response, text = paid_request(origin, rest[0], rest.length > 1 ? rest[1] : '{}', {})
      show_quote(status, response, text)
      exit(status == 402 ? 3 : status < 400 ? 0 : 1)
    when 'call'
      fail_with('call needs an endpoint and a JSON body', 2) if rest.length < 2
      fail_with('a signed payment is required: --payment <signature> or AG_PAYMENT (sign the quote with your own wallet)', 2) unless payment
      status, response, text = paid_request(origin, rest[0], rest[1], { 'PAYMENT-SIGNATURE' => payment })
      if status == 402
        show_quote(status, response, text)
        exit(3)
      end
      show(text)
      exit(status < 400 ? 0 : 1)
    else
      fail_with(%(unknown command "#{command}"\n\n#{USAGE}), 2)
    end
  end
end

AgCli.main if __FILE__ == $PROGRAM_NAME
