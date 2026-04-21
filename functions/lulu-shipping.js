// Cloudflare Pages Function — calcula frete via API Lulu.com
// Requer variáveis de ambiente: LULU_CLIENT_KEY, LULU_CLIENT_SECRET

const LULU_TOKEN_URL = 'https://api.lulu.com/auth/realms/glasstree/protocol/openid-connect/token';
const LULU_SHIPPING_URL = 'https://api.lulu.com/shipping-options/';

// US Letter Landscape (11"×8.5"), Full Color, Hardcover (Case Wrap), Standard quality
// Nota: verificar este código no painel developers.lulu.com/products se a API retornar erro 400
const POD_PACKAGE_ID = '1100X0850FCSTDCW060UW444MNG';

const PAGE_COUNTS = { essential: 50, journey: 100, legacy: 150 };

export async function onRequestPost(context) {
  const { request, env } = context;
  const origin = request.headers.get('Origin') || '';

  try {
    const { countryCode, modelId } = await request.json().catch(() => ({}));

    if (!countryCode || !modelId) {
      return errorRes('Missing countryCode or modelId', 400, origin);
    }

    const pageCount = PAGE_COUNTS[modelId] ?? 100;

    // 1. Obter token OAuth da Lulu
    const tokenRes = await fetch(LULU_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: env.LULU_CLIENT_KEY,
        client_secret: env.LULU_CLIENT_SECRET,
      }),
    });

    if (!tokenRes.ok) {
      return errorRes('Lulu auth failed', 502, origin);
    }

    const { access_token } = await tokenRes.json();

    // 2. Consultar opções de frete
    const shippingRes = await fetch(LULU_SHIPPING_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        line_items: [{ page_count: pageCount, pod_package_id: POD_PACKAGE_ID, quantity: 1 }],
        shipping_address: { country_code: countryCode },
        currency: 'EUR',
      }),
    });

    const data = await shippingRes.json();

    if (!shippingRes.ok) {
      return errorRes('Lulu shipping lookup failed', 502, origin);
    }

    const raw = data.shipping_options || [];

    const options = raw.map(o => ({
      level: o.level,
      label: o.title || o.level,
      cost_cents: Math.round(parseFloat(o.cost_incl_tax || o.cost_excl_tax || '0') * 100),
      dates: Array.isArray(o.estimated_shipping_dates) ? o.estimated_shipping_dates : [],
    })).sort((a, b) => a.cost_cents - b.cost_cents);

    return new Response(JSON.stringify({ options }), {
      status: 200,
      headers: corsHeaders(origin),
    });
  } catch (err) {
    return errorRes(err.message, 500, origin);
  }
}

export async function onRequestOptions(context) {
  const origin = context.request.headers.get('Origin') || '';
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}

function errorRes(msg, status, origin) {
  return new Response(JSON.stringify({ error: msg }), { status, headers: corsHeaders(origin) });
}

function corsHeaders(origin) {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
