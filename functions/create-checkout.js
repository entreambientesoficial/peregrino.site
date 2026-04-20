export async function onRequestPost(context) {
  const { request, env } = context;

  const origin = request.headers.get('Origin') || '';

  try {
    const body = await request.json().catch(() => ({}));
    const successUrl  = body.successUrl  || `${origin}/sucesso`;
    const cancelUrl   = body.cancelUrl   || `${origin}/#livro`;
    const modelId       = body.modelId       || 'journey';
    const modelLabel    = body.modelLabel    || 'Jornada';
    const modelPages    = body.modelPages    || 100;
    const customerEmail   = body.customerEmail   || null;
    const customerName    = body.customerName    || null;
    const shippingAddress = body.shippingAddress || null;

    const PRICES = { essential: 4990, journey: 7490, legacy: 9990 };
    const unitAmount = PRICES[modelId] ?? 7490;

    const payload = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: unitAmount,
            product_data: {
              name: `Coffee Table Book — Peregrino (${modelLabel})`,
              description: `Livro fotográfico personalizado com sua jornada no Caminho de Santiago. ${modelPages} páginas.`,
              images: ['https://meuperegrino.com/img-apoio/card1-St-Jean-Pied-de-Port.webp'],
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      ...(customerEmail && { customer_email: customerEmail }),
      ...(shippingAddress && {
        payment_intent_data: {
          shipping: {
            name: shippingAddress.name,
            address: {
              line1:       shippingAddress.line1,
              line2:       shippingAddress.line2 || undefined,
              city:        shippingAddress.city,
              state:       shippingAddress.state || undefined,
              postal_code: shippingAddress.postal_code,
              country:     shippingAddress.country,
            },
          },
        },
      }),
      custom_text: {
        submit: { message: 'Dúvidas? support@meuperegrino.com · Peregrino' },
        after_submit: { message: 'O seu livro será impresso e enviado para a morada indicada. Prazo estimado: 10–15 dias úteis.' },
      },
      metadata: {
        business_name: 'Peregrino',
        support_email: 'support@meuperegrino.com',
        model_id: modelId,
        model_label: modelLabel,
        model_pages: String(modelPages),
        ...(customerName && { customer_name: customerName }),
      },
      phone_number_collection: { enabled: false },
      locale: 'auto',
    };

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: encodeFormData(payload),
    });

    const session = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ error: session.error?.message || 'Stripe error' }), {
        status: response.status,
        headers: corsHeaders(origin),
      });
    }

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: corsHeaders(origin),
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: corsHeaders(origin),
    });
  }
}

export async function onRequestOptions(context) {
  const origin = context.request.headers.get('Origin') || '';
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}

function corsHeaders(origin) {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

// Stripe API usa application/x-www-form-urlencoded com estrutura aninhada
function encodeFormData(obj, prefix = '') {
  return Object.entries(obj)
    .flatMap(([key, value]) => {
      const fullKey = prefix ? `${prefix}[${key}]` : key;
      if (value === null || value === undefined) return [];
      if (typeof value === 'object' && !Array.isArray(value)) {
        return encodeFormData(value, fullKey).split('&');
      }
      if (Array.isArray(value)) {
        return value.flatMap((item, i) =>
          typeof item === 'object'
            ? encodeFormData(item, `${fullKey}[${i}]`).split('&')
            : [`${encodeURIComponent(`${fullKey}[${i}]`)}=${encodeURIComponent(item)}`]
        );
      }
      return [`${encodeURIComponent(fullKey)}=${encodeURIComponent(value)}`];
    })
    .join('&');
}
