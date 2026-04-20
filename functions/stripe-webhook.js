export async function onRequestPost(context) {
  const { request, env } = context;

  const signature = request.headers.get('stripe-signature');
  const body = await request.text();

  // Valida assinatura do webhook para garantir que veio do Stripe
  const isValid = await verifyStripeSignature(body, signature, env.STRIPE_WEBHOOK_SECRET);
  if (!isValid) {
    return new Response('Assinatura inválida', { status: 400 });
  }

  let event;
  try {
    event = JSON.parse(body);
  } catch {
    return new Response('Payload inválido', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Dados do pedido confirmado
    const order = {
      stripeSessionId: session.id,
      customerEmail:   session.customer_details?.email,
      customerName:    session.customer_details?.name,
      amountTotal:     session.amount_total,        // em cents
      currency:        session.currency,
      modelId:         session.metadata?.model_id,
      modelLabel:      session.metadata?.model_label,
      modelPages:      session.metadata?.model_pages,
      shippingAddress: session.shipping_details?.address,
      createdAt:       new Date(session.created * 1000).toISOString(),
    };

    console.log('[Webhook] Pedido confirmado:', JSON.stringify(order));

    // TODO: próximos passos após pagamento confirmado:
    // 1. Gravar pedido no Supabase (tabela orders)
    // 2. Buscar fotos do peregrino no Supabase
    // 3. Gerar PDF do livro (landscape 11x8.5")
    // 4. Enviar PDF para API Lulu.com
    // 5. Lulu imprime e envia ao cliente
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Verifica assinatura HMAC-SHA256 do Stripe
async function verifyStripeSignature(payload, sigHeader, secret) {
  if (!sigHeader || !secret) return false;

  try {
    const parts = Object.fromEntries(sigHeader.split(',').map(p => p.split('=')));
    const timestamp = parts['t'];
    const signature = parts['v1'];
    const signedPayload = `${timestamp}.${payload}`;

    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const sigBytes = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signedPayload));
    const computed = Array.from(new Uint8Array(sigBytes)).map(b => b.toString(16).padStart(2, '0')).join('');

    return computed === signature;
  } catch {
    return false;
  }
}
