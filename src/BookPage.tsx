import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, BookOpen, ImageIcon, CreditCard, CheckCircle } from 'lucide-react';

type Step = 'login' | 'photos' | 'editor' | 'checkout';

const STEPS: { id: Step; label: string; icon: React.ReactNode }[] = [
  { id: 'login',    label: 'Entrar',    icon: <CheckCircle size={16} /> },
  { id: 'photos',   label: 'Fotos',     icon: <ImageIcon size={16} /> },
  { id: 'editor',   label: 'Livro',     icon: <BookOpen size={16} /> },
  { id: 'checkout', label: 'Pagamento', icon: <CreditCard size={16} /> },
];

export default function BookPage() {
  const [step, setStep] = useState<Step>('login');

  const currentIndex = STEPS.findIndex(s => s.id === step);

  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans">

      {/* Header */}
      <header className="bg-[#1B2616] px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 text-[#E8E4D9]/60 hover:text-[#E8E4D9] transition-colors text-sm">
          <ArrowLeft size={16} />
          Voltar ao site
        </a>
        <span className="font-serif text-[#E8E4D9] italic text-lg">Peregrino</span>
        <div className="w-24" /> {/* spacer */}
      </header>

      {/* Progress bar */}
      <div className="bg-[#F5F2EA] border-b border-[#2D3A27]/8">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between gap-2">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors ${
                  i < currentIndex  ? 'bg-[#2D3A27] text-[#E8E4D9]' :
                  i === currentIndex ? 'bg-[#2D3A27] text-[#E8E4D9] ring-4 ring-[#2D3A27]/20' :
                  'bg-[#2D3A27]/10 text-[#2D3A27]/40'
                }`}>
                  {i < currentIndex ? <CheckCircle size={14} /> : i + 1}
                </div>
                <span className={`text-xs hidden sm:block transition-colors ${
                  i <= currentIndex ? 'text-[#2D3A27] font-medium' : 'text-[#2D3A27]/40'
                }`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px transition-colors ${i < currentIndex ? 'bg-[#2D3A27]' : 'bg-[#2D3A27]/15'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
          >
            {step === 'login'    && <StepLogin    onNext={() => setStep('photos')} />}
            {step === 'photos'   && <StepPhotos   onNext={() => setStep('editor')}   onBack={() => setStep('login')} />}
            {step === 'editor'   && <StepEditor   onNext={() => setStep('checkout')} onBack={() => setStep('photos')} />}
            {step === 'checkout' && <StepCheckout onBack={() => setStep('editor')} />}
          </motion.div>
        </AnimatePresence>
      </main>

    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 1 — Login
// ---------------------------------------------------------------------------
function StepLogin({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center gap-8 text-center max-w-md mx-auto">
      <div>
        <h1 className="font-serif text-3xl text-[#2D3A27] italic mb-3">Seu livro do Caminho</h1>
        <p className="text-[#2D3A27]/60 leading-relaxed">
          Entre com a sua conta Peregrino para acessar suas fotos e carimbos da jornada.
        </p>
      </div>

      {/* Placeholder — será substituído pelo Supabase Auth */}
      <div className="w-full bg-[#F5F2EA] rounded-3xl p-8 flex flex-col gap-4">
        <p className="text-xs uppercase tracking-widest text-[#2D3A27]/40 mb-2">Em breve</p>
        <p className="text-sm text-[#2D3A27]/60">
          O login com a conta do app Peregrino estará disponível quando o domínio definitivo for configurado.
        </p>
        <button
          onClick={onNext}
          className="mt-4 bg-[#2D3A27] text-[#E8E4D9] py-3 px-8 rounded-2xl text-sm font-medium hover:bg-[#1B2616] transition-colors flex items-center gap-2 justify-center"
        >
          Continuar (modo demo)
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 2 — Seleção de fotos
// ---------------------------------------------------------------------------
function StepPhotos({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h2 className="font-serif text-3xl text-[#2D3A27] italic mb-3">Suas fotos do Caminho</h2>
        <p className="text-[#2D3A27]/60">
          Selecione as fotos que deseja incluir no seu livro.
        </p>
      </div>

      {/* Placeholder — será substituído pela galeria do Supabase */}
      <div className="bg-[#F5F2EA] rounded-3xl p-10 flex flex-col items-center gap-4 text-center">
        <ImageIcon size={40} className="text-[#2D3A27]/20" />
        <p className="text-sm text-[#2D3A27]/40">
          Sua galeria de fotos do Caminho aparecerá aqui após o login com a conta do app.
        </p>
      </div>

      <NavButtons onBack={onBack} onNext={onNext} nextLabel="Personalizar livro" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 3 — Editor do livro
// ---------------------------------------------------------------------------
function StepEditor({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h2 className="font-serif text-3xl text-[#2D3A27] italic mb-3">Personalize seu livro</h2>
        <p className="text-[#2D3A27]/60">
          Escolha o formato, capa e disposição das páginas.
        </p>
      </div>

      {/* Placeholder — editor será desenvolvido na fase 2 */}
      <div className="bg-[#F5F2EA] rounded-3xl p-10 flex flex-col items-center gap-4 text-center">
        <BookOpen size={40} className="text-[#2D3A27]/20" />
        <div>
          <p className="text-sm text-[#2D3A27]/60 mb-1">Editor em desenvolvimento</p>
          <p className="text-xs text-[#2D3A27]/40">
            Formato A4 · Capa dura · ~60 páginas · Impressão profissional
          </p>
        </div>

        {/* Preview do produto */}
        <div className="mt-4 bg-white rounded-2xl p-6 w-full max-w-sm shadow-sm border border-[#2D3A27]/8">
          <p className="text-xs uppercase tracking-widest text-[#2D3A27]/40 mb-3">Resumo do pedido</p>
          <div className="flex justify-between text-sm text-[#2D3A27] mb-2">
            <span>Coffee Table Book — Peregrino</span>
            <span className="font-semibold">€79</span>
          </div>
          <div className="flex justify-between text-xs text-[#2D3A27]/40">
            <span>Impressão + envio internacional</span>
            <span>incluso</span>
          </div>
        </div>
      </div>

      <NavButtons onBack={onBack} onNext={onNext} nextLabel="Ir para pagamento" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 4 — Checkout
// ---------------------------------------------------------------------------
function StepCheckout({ onBack }: { onBack: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          successUrl: `${window.location.origin}/sucesso`,
          cancelUrl:  `${window.location.origin}/book`,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError('Não foi possível iniciar o pagamento. Tente novamente.');
      }
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-md mx-auto">
      <div className="text-center">
        <h2 className="font-serif text-3xl text-[#2D3A27] italic mb-3">Confirmar pedido</h2>
        <p className="text-[#2D3A27]/60">Revise seu pedido antes de prosseguir para o pagamento.</p>
      </div>

      <div className="bg-[#F5F2EA] rounded-3xl p-6 flex flex-col gap-4">
        <div className="flex justify-between text-sm text-[#2D3A27]">
          <span>Coffee Table Book — Peregrino</span>
          <span className="font-semibold">€79,00</span>
        </div>
        <div className="flex justify-between text-xs text-[#2D3A27]/40">
          <span>Impressão profissional + envio internacional</span>
          <span>incluso</span>
        </div>
        <div className="border-t border-[#2D3A27]/10 pt-4 flex justify-between font-semibold text-[#2D3A27]">
          <span>Total</span>
          <span>€79,00</span>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <motion.button
        onClick={handleCheckout}
        disabled={loading}
        whileHover={loading ? {} : { scale: 1.02 }}
        whileTap={loading ? {} : { scale: 0.98 }}
        className="w-full bg-[#2D3A27] text-[#E8E4D9] py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-[#1B2616] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            A preparar pagamento...
          </>
        ) : (
          <>
            <CreditCard size={18} />
            Pagar com cartão — €79,00
          </>
        )}
      </motion.button>

      <button onClick={onBack} className="text-sm text-[#2D3A27]/40 hover:text-[#2D3A27] transition-colors text-center">
        ← Voltar ao editor
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Navegação entre steps
// ---------------------------------------------------------------------------
function NavButtons({ onBack, onNext, nextLabel = 'Continuar' }: { onBack: () => void; onNext: () => void; nextLabel?: string }) {
  return (
    <div className="flex justify-between pt-4">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-[#2D3A27]/50 hover:text-[#2D3A27] transition-colors"
      >
        <ArrowLeft size={16} /> Voltar
      </button>
      <motion.button
        onClick={onNext}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2 bg-[#2D3A27] text-[#E8E4D9] px-6 py-3 rounded-2xl text-sm font-medium hover:bg-[#1B2616] transition-colors"
      >
        {nextLabel} <ArrowRight size={16} />
      </motion.button>
    </div>
  );
}
