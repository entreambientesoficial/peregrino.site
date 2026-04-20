import React, { useRef, useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useT, AVAILABLE_LANGS } from './i18n';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValueEvent } from 'framer-motion';
import {
  MapPin, ShieldAlert,
  CloudSun, Activity, QrCode as QrIcon, Scroll,
  Camera, X, ArrowRight
} from 'lucide-react';

export default function LandingPage() {
  return <LandingPageInner />;
}

const Footer = ({ onOpenLegal }: { onOpenLegal: (page: LegalPage) => void }) => {
  const { lang, setLang } = useT();

  return (
    <footer className="bg-[#1B2616] text-[#E8E4D9]/60 px-6 py-12 md:py-16">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-10">

        {/* Logo / nome */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <img src="/img-apoio/vieira.png" alt="" className="h-12 object-contain" />
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#E8E4D9' }} className="text-4xl tracking-tight">Peregrino</span>
          </div>
        </div>

        {/* Seletor de idioma — grade inline, sem dropdown */}
        <div className="flex flex-wrap justify-center gap-2">
          {AVAILABLE_LANGS.map(l => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans transition-colors border ${
                l.code === lang
                  ? 'bg-[#E8E4D9]/15 border-[#E8E4D9]/30 text-[#E8E4D9]'
                  : 'border-transparent text-[#E8E4D9]/40 hover:text-[#E8E4D9]/70 hover:border-[#E8E4D9]/15'
              }`}
            >
              <span>{l.flag}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>

        {/* Links legais */}
        <div className="flex flex-wrap justify-center gap-6 text-xs uppercase tracking-widest text-[#E8E4D9]/30">
          <button onClick={() => onOpenLegal('terms')} className="hover:text-[#E8E4D9]/60 transition-colors">Termos de Uso</button>
          <span className="text-[#E8E4D9]/15">·</span>
          <button onClick={() => onOpenLegal('privacy')} className="hover:text-[#E8E4D9]/60 transition-colors">Privacidade</button>
          <span className="text-[#E8E4D9]/15">·</span>
          <button onClick={() => onOpenLegal('contact')} className="hover:text-[#E8E4D9]/60 transition-colors">Contato</button>
        </div>

        {/* Copyright */}
        <p className="text-xs text-[#E8E4D9]/20 text-center">
          © {new Date().getFullYear()} Peregrino. Todos os direitos reservados.
        </p>

      </div>
    </footer>
  );
};

type LegalPage = 'terms' | 'privacy' | 'contact' | null;

function LandingPageInner() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [legalPage, setLegalPage] = useState<LegalPage>(null);
  const { isCJK } = useT();

  return (
    <div
      className="min-h-screen bg-[#FDFCF8] font-sans selection:bg-[#2D3A27] selection:text-[#E8E4D9]"
      style={isCJK ? { fontFamily: "'Noto Sans JP', 'Noto Sans KR', 'Noto Sans SC', sans-serif" } : {}}
    >
      <HeroSection onOpenModal={() => setIsModalOpen(true)} />
      <FeaturesSection />
      <JourneySection />
      <BookSection />
      <Footer onOpenLegal={setLegalPage} />

      <AnimatePresence>
        {isModalOpen && (
          <DownloadModal onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {legalPage && (
          <LegalModal page={legalPage} onClose={() => setLegalPage(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LegalModal — Termos de Uso, Privacidade e Contato
// ---------------------------------------------------------------------------

const LEGAL_CONTENT: Record<NonNullable<LegalPage>, { title: string; body: React.ReactNode }> = {
  terms: {
    title: 'Termos de Uso',
    body: (
      <div className="space-y-6 text-sm leading-relaxed text-[#2D3A27]/80">
        <p className="text-xs text-[#2D3A27]/40 uppercase tracking-widest">Última atualização: abril de 2026</p>

        <section>
          <h3 className="font-semibold text-[#2D3A27] mb-2">1. Aceitação dos Termos</h3>
          <p>Ao acessar ou utilizar o site <strong>meuperegrino.com</strong> ("Site") e seus serviços, incluindo a compra de produtos físicos como o Coffee Table Book, você declara ter lido, compreendido e concordado com estes Termos de Uso. Caso não concorde, não utilize o Site.</p>
        </section>

        <section>
          <h3 className="font-semibold text-[#2D3A27] mb-2">2. Descrição dos Serviços</h3>
          <p>O Site oferece:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Informações sobre o aplicativo Peregrino e suas funcionalidades;</li>
            <li>Venda do <strong>Coffee Table Book</strong> — livro impresso personalizado com registros da jornada do peregrino no Caminho de Santiago;</li>
            <li>Outros produtos que venham a ser disponibilizados futuramente.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold text-[#2D3A27] mb-2">3. Compra do Coffee Table Book</h3>
          <p>O livro é um produto personalizado e sob demanda, produzido exclusivamente após a confirmação do pagamento. Por essa razão:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Não é possível cancelar o pedido após a produção ser iniciada;</li>
            <li>O prazo de entrega pode variar conforme o destino e a gráfica parceira;</li>
            <li>O conteúdo do livro é baseado nos dados e fotos registrados pelo usuário no aplicativo Peregrino;</li>
            <li>A qualidade das imagens no livro depende diretamente da qualidade das fotos registradas pelo usuário.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold text-[#2D3A27] mb-2">4. Pagamentos</h3>
          <p>Os pagamentos são processados de forma segura pela plataforma <strong>Stripe</strong>, sujeita aos seus próprios termos e política de privacidade. O Peregrino não armazena dados de cartão de crédito. Em caso de recusa de pagamento, o pedido não será processado.</p>
        </section>

        <section>
          <h3 className="font-semibold text-[#2D3A27] mb-2">5. Direito de Arrependimento (consumidores na UE e Brasil)</h3>
          <p>Por se tratar de produto personalizado e produzido sob demanda, o direito de arrependimento previsto no Código de Defesa do Consumidor (Art. 49, CDC) e na Diretiva Europeia 2011/83/UE é inaplicável após o início da produção, conforme as exceções legais vigentes para bens confeccionados segundo especificações do consumidor.</p>
          <p className="mt-2">Caso o produto chegue com defeito de fabricação ou divergente do pedido, o usuário deve entrar em contato em até <strong>7 dias corridos</strong> após o recebimento para solicitação de reenvio ou reembolso.</p>
        </section>

        <section>
          <h3 className="font-semibold text-[#2D3A27] mb-2">6. Propriedade Intelectual</h3>
          <p>Todo o conteúdo do Site — textos, imagens, vídeos, marca e design — é de propriedade exclusiva do Peregrino ou de seus licenciantes, protegido pela legislação de direitos autorais. É vedada a reprodução sem autorização prévia e expressa.</p>
          <p className="mt-2">As fotos inseridas pelo usuário no aplicativo permanecem de sua propriedade. O usuário concede ao Peregrino licença limitada para uso exclusivo na produção do livro personalizado.</p>
        </section>

        <section>
          <h3 className="font-semibold text-[#2D3A27] mb-2">7. Limitação de Responsabilidade</h3>
          <p>O Peregrino não se responsabiliza por atrasos de entrega causados por transportadoras, alfândega, greves ou eventos de força maior. Na extensão permitida por lei, nossa responsabilidade máxima limita-se ao valor pago pelo produto.</p>
        </section>

        <section>
          <h3 className="font-semibold text-[#2D3A27] mb-2">8. Alterações nos Termos</h3>
          <p>Estes Termos podem ser atualizados a qualquer momento. A versão vigente é sempre a publicada neste Site. O uso continuado após alterações constitui aceitação dos novos termos.</p>
        </section>

        <section>
          <h3 className="font-semibold text-[#2D3A27] mb-2">9. Lei Aplicável e Foro</h3>
          <p>Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da comarca de São Paulo/SP para dirimir quaisquer disputas, sem prejuízo do direito do consumidor de recorrer ao foro de seu domicílio.</p>
        </section>
      </div>
    ),
  },

  privacy: {
    title: 'Política de Privacidade',
    body: (
      <div className="space-y-6 text-sm leading-relaxed text-[#2D3A27]/80">
        <p className="text-xs text-[#2D3A27]/40 uppercase tracking-widest">Última atualização: abril de 2026 · LGPD + GDPR</p>

        <section>
          <h3 className="font-semibold text-[#2D3A27] mb-2">1. Controlador dos Dados</h3>
          <p>O Peregrino é o controlador dos dados pessoais coletados neste Site, conforme a Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018) e o Regulamento Geral de Proteção de Dados da União Europeia (GDPR — Regulamento 2016/679).</p>
          <p className="mt-2">Contato do encarregado (DPO): <strong>contact@meuperegrino.com</strong></p>
        </section>

        <section>
          <h3 className="font-semibold text-[#2D3A27] mb-2">2. Dados Coletados</h3>
          <p>Coletamos apenas os dados estritamente necessários:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Dados de navegação:</strong> endereço IP, tipo de navegador, páginas visitadas e idioma do dispositivo — para análise de desempenho e segurança;</li>
            <li><strong>Dados de compra:</strong> nome, e-mail e endereço de entrega — fornecidos voluntariamente no checkout para processamento do pedido;</li>
            <li><strong>Preferência de idioma:</strong> armazenada localmente no seu dispositivo (localStorage), nunca enviada a servidores.</li>
          </ul>
          <p className="mt-2"><strong>Não coletamos</strong> dados de cartão de crédito (processados diretamente pelo Stripe) nem dados de saúde ou localização.</p>
        </section>

        <section>
          <h3 className="font-semibold text-[#2D3A27] mb-2">3. Finalidade e Base Legal</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Execução de contrato (Art. 7°, V — LGPD / Art. 6°, 1b — GDPR):</strong> processar e entregar pedidos;</li>
            <li><strong>Legítimo interesse:</strong> segurança do site e prevenção a fraudes;</li>
            <li><strong>Consentimento:</strong> envio de comunicações de marketing, quando solicitado explicitamente.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold text-[#2D3A27] mb-2">4. Compartilhamento de Dados</h3>
          <p>Seus dados podem ser compartilhados com:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Stripe Inc.</strong> — processamento de pagamentos (EUA, certificado PCI-DSS nível 1);</li>
            <li><strong>Supabase Inc.</strong> — infraestrutura de banco de dados;</li>
            <li><strong>Transportadoras parceiras</strong> — exclusivamente nome e endereço de entrega.</li>
          </ul>
          <p className="mt-2">Não vendemos nem alugamos dados pessoais a terceiros.</p>
        </section>

        <section>
          <h3 className="font-semibold text-[#2D3A27] mb-2">5. Transferência Internacional</h3>
          <p>Stripe e Supabase operam em servidores nos Estados Unidos. A transferência é realizada com base em Cláusulas Contratuais Padrão (SCCs) aprovadas pela Comissão Europeia, em conformidade com o GDPR.</p>
        </section>

        <section>
          <h3 className="font-semibold text-[#2D3A27] mb-2">6. Retenção de Dados</h3>
          <p>Dados de pedidos são mantidos por <strong>5 anos</strong> para fins fiscais e legais. Dados de navegação são anonimizados após <strong>90 dias</strong>. Você pode solicitar a exclusão antecipada conforme o item 7 abaixo.</p>
        </section>

        <section>
          <h3 className="font-semibold text-[#2D3A27] mb-2">7. Seus Direitos</h3>
          <p>Conforme LGPD e GDPR, você tem direito a:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Acesso</strong> — confirmar se tratamos seus dados e obter cópia;</li>
            <li><strong>Retificação</strong> — corrigir dados incompletos ou incorretos;</li>
            <li><strong>Exclusão</strong> — solicitar o apagamento dos seus dados;</li>
            <li><strong>Portabilidade</strong> — receber seus dados em formato estruturado;</li>
            <li><strong>Oposição</strong> — opor-se ao tratamento baseado em legítimo interesse;</li>
            <li><strong>Revogação do consentimento</strong> — a qualquer momento, sem prejuízo da legalidade do tratamento anterior.</li>
          </ul>
          <p className="mt-2">Para exercer seus direitos: <strong>contact@meuperegrino.com</strong>. Respondemos em até 15 dias úteis.</p>
        </section>

        <section>
          <h3 className="font-semibold text-[#2D3A27] mb-2">8. Cookies</h3>
          <p>Utilizamos apenas cookies estritamente necessários para funcionamento do site (preferência de idioma). Não utilizamos cookies de rastreamento ou publicidade.</p>
        </section>

        <section>
          <h3 className="font-semibold text-[#2D3A27] mb-2">9. Segurança</h3>
          <p>Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados contra acesso não autorizado, perda ou destruição, incluindo criptografia TLS em todas as transmissões.</p>
        </section>

        <section>
          <h3 className="font-semibold text-[#2D3A27] mb-2">10. Autoridade de Supervisão</h3>
          <p>Usuários brasileiros podem recorrer à <strong>ANPD</strong> (Autoridade Nacional de Proteção de Dados — gov.br/anpd). Usuários da União Europeia podem recorrer à autoridade de proteção de dados do seu país de residência.</p>
        </section>
      </div>
    ),
  },

  contact: {
    title: 'Contato',
    body: (
      <div className="space-y-8 text-sm leading-relaxed text-[#2D3A27]/80">
        <p>Tem dúvidas, sugestões ou precisa de suporte? Entre em contato pelos canais abaixo. Respondemos em até <strong>2 dias úteis</strong>.</p>

        <div className="space-y-4">
          <div className="bg-[#F5F2EA] rounded-2xl p-5">
            <p className="text-xs uppercase tracking-widest text-[#2D3A27]/40 mb-1">E-mail geral</p>
            <a href="mailto:contact@meuperegrino.com" className="text-[#2D3A27] font-medium hover:underline">contact@meuperegrino.com</a>
          </div>

          <div className="bg-[#F5F2EA] rounded-2xl p-5">
            <p className="text-xs uppercase tracking-widest text-[#2D3A27]/40 mb-1">Suporte a pedidos</p>
            <a href="mailto:support@meuperegrino.com" className="text-[#2D3A27] font-medium hover:underline">support@meuperegrino.com</a>
            <p className="text-xs text-[#2D3A27]/40 mt-1">Para dúvidas sobre seu Coffee Table Book</p>
          </div>

          <div className="bg-[#F5F2EA] rounded-2xl p-5">
            <p className="text-xs uppercase tracking-widest text-[#2D3A27]/40 mb-1">Privacidade & LGPD / GDPR</p>
            <a href="mailto:support@meuperegrino.com" className="text-[#2D3A27] font-medium hover:underline">support@meuperegrino.com</a>
            <p className="text-xs text-[#2D3A27]/40 mt-1">Para solicitações de acesso, exclusão ou portabilidade de dados</p>
          </div>
        </div>

        <p className="text-xs text-[#2D3A27]/40">
          Respondemos em até 2 dias úteis em português, inglês e espanhol.
        </p>
      </div>
    ),
  },
};

const LegalModal = ({ page, onClose }: { page: NonNullable<LegalPage>; onClose: () => void }) => {
  const content = LEGAL_CONTENT[page];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="relative z-10 w-full sm:max-w-2xl bg-[#FDFCF8] rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-7 pb-4 border-b border-[#2D3A27]/8 shrink-0">
          <h2 className="font-serif text-xl text-[#2D3A27] italic">{content.title}</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#2D3A27]/8 flex items-center justify-center hover:bg-[#2D3A27]/15 transition-colors"
          >
            <X size={16} className="text-[#2D3A27]" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-7 py-6 flex-1">
          {content.body}
        </div>

        {/* Footer */}
        <div className="px-7 pb-7 pt-4 border-t border-[#2D3A27]/8 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-[#2D3A27] text-[#E8E4D9] text-sm font-medium hover:bg-[#1B2616] transition-colors"
          >
            Fechar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const HeroSection = ({ onOpenModal }: { onOpenModal: () => void }) => {
  const { t } = useT();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const titleLines = t('hero.title').split('\n');

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover">
          <source src="video-apoio/2.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 flex flex-col items-center justify-center text-center px-4"
      >
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-[#E8E4D9] mb-8 tracking-tight drop-shadow-md">
          {titleLines[0]}{titleLines[1] && <><br />{titleLines[1]}</>}
        </h1>
        <motion.button
          onClick={onOpenModal}
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(232,228,217,1)', color: '#2D3A27' }}
          whileTap={{ scale: 0.95 }}
          className="border border-[#E8E4D9] text-[#E8E4D9] px-8 py-4 rounded-full text-lg font-medium tracking-wide transition-colors duration-300 backdrop-blur-sm"
        >
          {t('hero.cta')}
        </motion.button>
      </motion.div>
    </section>
  );
};

type Platform = 'ios' | 'android' | 'desktop';

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  if (/android/.test(ua)) return 'android';
  return 'desktop';
}

const DownloadModal = ({ onClose }: { onClose: () => void }) => {
  const { t } = useT();
  const platform = detectPlatform();
  const [tab, setTab] = useState<'ios' | 'android'>(
    platform === 'android' ? 'android' : 'ios'
  );
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleNativeInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
    onClose();
  };

  const iosSteps  = ['modal.pwa.ios.s1',  'modal.pwa.ios.s2',  'modal.pwa.ios.s3',  'modal.pwa.ios.s4'];
  const droidSteps = ['modal.pwa.android.s1','modal.pwa.android.s2','modal.pwa.android.s3','modal.pwa.android.s4'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
    >
      <div className="absolute inset-0 bg-[#1B2616]/60 backdrop-blur-xl" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative bg-[#F4F1EA] w-full max-w-2xl rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20"
      >
        <button
          onClick={onClose}
          className="absolute top-8 right-8 p-2 rounded-full bg-[#2D3A27]/5 text-[#2D3A27] hover:bg-[#2D3A27]/10 transition-colors z-20"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col md:flex-row">

          {/* Lado esquerdo — passos */}
          <div className="flex-1 p-10 md:p-14 flex flex-col justify-center">
            <span className="text-xs uppercase tracking-[0.3em] text-[#2D3A27]/40 font-sans font-black mb-3 block">
              {t('modal.tagline')}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-[#2D3A27] leading-tight italic mb-1">
              {t('modal.pwa.title')}
            </h2>
            <p className="text-xs text-[#2D3A27]/40 font-sans mb-7">{t('modal.pwa.free')}</p>

            {/* Tabs iOS / Android — sempre visível */}
            <div className="flex gap-2 mb-6">
              {(['ios', 'android'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setTab(p)}
                  className={`px-4 py-1.5 rounded-full text-xs font-sans font-semibold transition-colors border ${
                    tab === p
                      ? 'bg-[#2D3A27] text-[#E8E4D9] border-[#2D3A27]'
                      : 'text-[#2D3A27]/50 border-[#2D3A27]/20 hover:border-[#2D3A27]/40'
                  }`}
                >
                  {t(`modal.pwa.${p}.tab`)}
                </button>
              ))}
            </div>

            {/* Passos */}
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-xs text-[#2D3A27]/50 uppercase tracking-widest mb-4 font-sans">
                  {t(`modal.pwa.${tab}.hint`)}
                </p>
                <ol className="flex flex-col gap-3">
                  {(tab === 'ios' ? iosSteps : droidSteps).map((key, i) => (
                    <li key={key} className="flex items-start gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-[#2D3A27]/10 text-[#2D3A27] text-xs font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-sm text-[#2D3A27]/80 font-sans leading-relaxed">{t(key)}</span>
                    </li>
                  ))}
                </ol>

                {/* Botão nativo Android (Chrome) */}
                {tab === 'android' && installPrompt && (
                  <motion.button
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={handleNativeInstall}
                    className="mt-6 w-full bg-[#2D3A27] text-[#E8E4D9] py-3.5 rounded-2xl font-sans font-semibold text-sm flex items-center justify-center gap-2 shadow-lg"
                  >
                    {t('modal.pwa.android.btn')}
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Lado direito — QR Code (desktop only) */}
          <div className="hidden md:flex w-[220px] bg-[#2D3A27] p-10 flex-col items-center justify-center text-center border-l border-black/5 shrink-0">
            <div className="p-4 bg-white rounded-3xl shadow-xl mb-5">
              {/* TODO: trocar URL quando domínio for definido */}
              <QRCodeSVG
                value="https://app.meuperegrino.com"
                size={112}
                bgColor="#ffffff"
                fgColor="#1B2616"
                level="M"
              />
            </div>
            <p className="text-[#E8E4D9] text-sm font-serif italic mb-2 leading-snug">
              {t('modal.pwa.desktop.title')}
            </p>
            <p className="text-[#E8E4D9]/50 text-xs font-sans leading-relaxed">
              {t('modal.pwa.desktop.sub')}
            </p>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const { t } = useT();
  const cards = [
    { titleKey: 'features.sos.title',     descKey: 'features.sos.desc',     icon: <ShieldAlert className="w-8 h-8 text-[#E8E4D9]" strokeWidth={1} />, className: "md:col-span-2 bg-gradient-to-br from-[#2D4F3C] to-[#1E3A2B] border-[#ffffff10]" },
    { titleKey: 'features.weather.title', descKey: 'features.weather.desc', icon: <CloudSun    className="w-6 h-6 text-[#E8E4D9]" strokeWidth={1} />, className: "bg-gradient-to-br from-[#3E4A33] to-[#2D3A27] border-[#ffffff10]" },
    { titleKey: 'features.terrain.title', descKey: 'features.terrain.desc', icon: <Activity    className="w-6 h-6 text-[#E8E4D9]" strokeWidth={1} />, className: "bg-gradient-to-br from-[#4A3728] to-[#2D1B12] border-[#ffffff10]" },
    { titleKey: 'features.legacy.title',  descKey: 'features.legacy.desc',  icon: <Scroll      className="w-8 h-8 text-[#E8E4D9]" strokeWidth={1} />, className: "md:col-span-2 bg-gradient-to-br from-[#1E3A2B] to-[#0F1A13] border-[#ffffff10]" },
    { titleKey: 'features.stamps.title',  descKey: 'features.stamps.desc',  icon: <QrIcon      className="w-6 h-6 text-[#E8E4D9]" strokeWidth={1} />, className: "bg-gradient-to-br from-[#2D3327] to-[#1B2616] border-[#ffffff10]" },
    { titleKey: 'features.guide.title',   descKey: 'features.guide.desc',   icon: <MapPin      className="w-6 h-6 text-[#E8E4D9]" strokeWidth={1} />, className: "bg-gradient-to-br from-[#3E4A33] to-[#2D3A27] border-[#ffffff10]" },
    { titleKey: 'features.camera.title',  descKey: 'features.camera.desc',  icon: <Camera      className="w-6 h-6 text-[#E8E4D9]" strokeWidth={1} />, className: "bg-gradient-to-br from-[#4A3728] to-[#2D1B12] border-[#ffffff10]" },
  ];

  return (
    <section className="py-32 px-4 md:px-8 relative bg-[#1B2616] overflow-hidden">
      {/* Organic Background Textures */}
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-topography opacity-10 pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24 max-w-2xl mx-auto">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-xs uppercase tracking-[0.4em] text-[#E8E4D9]/40 font-sans font-bold mb-4 block"
          >
            {t('features.eyebrow')}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl md:text-6xl text-[#E8E4D9] leading-tight text-balance"
          >
            {t('features.title')}
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ 
                y: -12, 
                scale: 1.02,
                boxShadow: "0 40px 80px -20px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)",
                transition: { duration: 0.4, ease: "easeOut" } 
              }}
              className={`group relative rounded-[3rem] border border-white/5 shadow-tactile flex flex-col min-h-[340px] transition-all duration-700 overflow-hidden ${card.className}`}
            >
              {/* Inner Gradient Glow */}
              <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-tr from-white/[0.03] to-transparent pointer-events-none" />
              
              {/* Header Space (Compact) */}
              <div className="relative z-10 flex items-center gap-4 px-10 pt-10 mb-2">
                <div className="p-3 rounded-full bg-black/20 shadow-[inset_0_2px_10px_rgba(0,0,0,0.3)] border border-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-700 shrink-0">
                  {/* Matching the icon size from the previous 'compact' version */}
                  {React.cloneElement(card.icon as React.ReactElement, { className: 'w-6 h-6 text-[#E8E4D9]' })}
                </div>
                <h3 className="font-serif text-2xl font-medium tracking-tight leading-tight text-[#E8E4D9]">
                  {t(card.titleKey)}
                </h3>
              </div>

              {/* Centralization Space (Visual Symmetry) */}
              <div className="relative z-10 flex-1 flex flex-col justify-center px-10 pb-4">
                <p className="font-sans leading-relaxed text-lg md:text-xl font-normal text-[#E8E4D9] group-hover:text-white transition-colors duration-500">
                  {t(card.descKey)}
                </p>
              </div>

              {/* Decorative Shine */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background Glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#2D4F3C]/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#4A3728]/20 blur-[120px] rounded-full pointer-events-none" />
    </section>
  );
};

const JourneySection = () => {
  const { t } = useT();
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const total = 12;
    const idx = Math.min(Math.floor(latest * total), total - 1);
    setActiveIndex(idx);
  });

  const routes = [
    { nameKey: "journey.name.frances",           tagKey: "journey.tag.frances",           startKey: null,                        start: "St-Jean-Pied-de-Port / Somport", dist: "765km", steps: 33, img: "/img-apoio/card1-St-Jean-Pied-de-Port.webp" },
    { nameKey: "journey.name.portugues.central", tagKey: "journey.tag.portugues.central", startKey: null,                        start: "Porto",                          dist: "274km", steps: 11, img: "/img-apoio/card2-porto.webp" },
    { nameKey: "journey.name.portugues.lisboa",  tagKey: "journey.tag.portugues.lisboa",  startKey: "journey.start.lisboa",      start: "Lisboa",                         dist: "625km", steps: 25, img: "/img-apoio/card10-caminho-portugues-lisboa.webp" },
    { nameKey: "journey.name.portugues.costa",   tagKey: "journey.tag.portugues.costa",   startKey: "journey.start.porto.costa", start: "Porto (variante litoral)",        dist: "281km", steps: 13, img: "/img-apoio/card3-Porto-litoral.webp" },
    { nameKey: "journey.name.interior",          tagKey: "journey.tag.interior",          startKey: null,                        start: "Viseu",                          dist: "426km", steps: 17, img: "/img-apoio/card9-viseu.webp" },
    { nameKey: "journey.name.primitivo",         tagKey: "journey.tag.primitivo",         startKey: null,                        start: "Oviedo",                         dist: "321km", steps: 14, img: "/img-apoio/card4-oviedo.webp" },
    { nameKey: "journey.name.norte",             tagKey: "journey.tag.norte",             startKey: null,                        start: "Irún",                           dist: "817km", steps: 35, img: "/img-apoio/card5-norte.webp" },
    { nameKey: "journey.name.ingles",            tagKey: "journey.tag.ingles",            startKey: null,                        start: "Ferrol / A Coruña",              dist: "126km", steps:  6, img: "/img-apoio/card6-ferrol.webp" },
    { nameKey: "journey.name.aragones",          tagKey: "journey.tag.aragones",          startKey: null,                        start: "Somport",                        dist: "166km", steps:  6, img: "/img-apoio/card11-caminho-aragones.webp" },
    { nameKey: "journey.name.plata",             tagKey: "journey.tag.plata",             startKey: "journey.start.sevilha",     start: "Sevilha",                        dist: "990km", steps: 36, img: "/img-apoio/card7-via-de-la-plata.webp" },
    { nameKey: "journey.name.sanabres",          tagKey: "journey.tag.sanabres",          startKey: null,                        start: "Granja de Moreruela",            dist: "340km", steps: 11, img: "/img-apoio/card8-granja-de-moreruela.webp" },
    { nameKey: "journey.name.inverno",           tagKey: "journey.tag.inverno",           startKey: null,                        start: "Ponferrada",                     dist: "269km", steps: 10, img: "/img-apoio/card12-caminho-de-inverno.webp" },
  ];


  const total = routes.length;

  return (
    <section ref={sectionRef} className="h-[740vh] relative z-20 bg-[#E8E4D9]">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center">

        <div className="relative z-30 pt-8 md:pt-10 text-center px-4 w-full bg-transparent pb-4">
          <motion.h2
            className="font-serif text-4xl md:text-7xl text-[#2D3A27] tracking-tight italic"
          >
            {t('journey.title')}
          </motion.h2>
          <div className="mt-2 h-px w-24 bg-[#2D3A27]/20 mx-auto" />
        </div>

        <div className="relative w-full max-w-5xl h-[420px] md:h-[500px] px-4 md:px-0 mt-6 md:mt-8 z-10">
          {routes.map((route, idx) => (
            <SequentialCard
              key={idx}
              route={route}
              index={idx}
              total={total}
              progress={scrollYProgress}
            />
          ))}
        </div>

        {/* Indicador de progresso */}
        <div className="flex items-center gap-3 mt-6 z-30">
          <div className="flex gap-1.5">
            {routes.map((_, idx) => (
              <div
                key={idx}
                className="rounded-full transition-all duration-300"
                style={{
                  width: idx === activeIndex ? '20px' : '6px',
                  height: '6px',
                  backgroundColor: idx === activeIndex ? '#2D3A27' : '#2D3A2740',
                }}
              />
            ))}
          </div>
          <span className="font-sans text-xs text-[#2D3A27]/50 tabular-nums tracking-wider">
            {activeIndex + 1} / {total}
          </span>
        </div>

      </div>
    </section>
  );
};

const SequentialCard = ({ route, index, total, progress }: { route: any, index: number, total: number, progress: any }) => {
  const { t } = useT();
  const isLast = index === total - 1;
  const segment = 1.0 / total;
  const start = index * segment;
  const end = (index + 1) * segment;

  // Último card nunca sai — fica fixo até a próxima seção cobri-lo
  const y = useTransform(progress, [start, isLast ? 1 : end], [0, isLast ? 0 : -1000]);
  const opacity = useTransform(progress, [start, isLast ? 1 : end], [1, 1]);
  const scale = useTransform(progress, [start, isLast ? 1 : end], [1, isLast ? 1 : 0.9]);
  const rotate = useTransform(progress, [start, isLast ? 1 : end], [0, isLast ? 0 : -10]);

  return (
    <motion.div
      style={{ 
        y, 
        opacity, 
        scale,
        rotate,
        zIndex: total - index,
        position: 'absolute',
        paddingTop: '0', // Reset any padding
        transform: 'translate(-50%, -50%)', // Use standard transform for static centering
        marginTop: y, // Using marginTop for the vertical movement animation
      }}
      className="w-full max-w-5xl h-[450px] md:h-[500px] rounded-[3.5rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col justify-end p-8 md:p-16 group border border-white/10 bg-[#1B2616]"
    >
      {/* Nature Image */}
      <div className="absolute inset-0 z-0 scale-105 group-hover:scale-110 transition-transform duration-[5s] ease-out">
        <img 
          src={route.img}
          alt={t(route.nameKey)}
          className="w-full h-full object-cover"
        />
        {/* Dark transparency overlay requested by user */}
        <div className="absolute inset-0 bg-black/40 z-10" />
        {/* Gradient shadow for text emphasis */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent z-20" />
      </div>
      
      {/* Content */}
      <div className="relative z-20 flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12 text-left">
        <div className="max-w-2xl">
          <span className="text-[#E8E4D9]/60 text-xs md:text-sm uppercase tracking-[0.4em] font-sans font-black mb-4 block">
            {t(route.tagKey)}
          </span>
          <h3 className="font-serif text-4xl md:text-7xl text-[#E8E4D9] mb-8 tracking-tighter leading-none group-hover:text-white transition-colors">
            {t(route.nameKey)}
          </h3>
          <div className="flex flex-wrap gap-8 text-[#E8E4D9]/80 font-sans text-sm md:text-base border-t border-white/10 pt-8">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{t('journey.label.start')}</span>
              <span className="font-medium font-serif italic text-lg text-[#E8E4D9]">{route.startKey ? t(route.startKey) : route.start}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{t('journey.label.dist')}</span>
              <span className="font-medium font-serif italic text-lg text-white">{route.dist}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{t('journey.label.stages')}</span>
              <span className="font-medium font-serif italic text-lg text-[#E8E4D9]">{route.steps}</span>
            </div>
          </div>
        </div>
        
        {/* Removido o emblema ícone conforme solicitado */}
        <div className="hidden md:flex flex-col items-end pb-2">
        </div>
      </div>
    </motion.div>
  );
};

const OrderBookButton = () => {
  const { t } = useT();

  return (
    <motion.a
      href="/book"
      whileHover={{ scale: 1.05, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)' }}
      whileTap={{ scale: 0.95 }}
      className="bg-[#2D1B14] text-[#FDFCF8] px-8 md:px-12 py-4 md:py-5 rounded-full text-base md:text-lg font-bold shadow-2xl flex items-center gap-3 border border-white/5"
    >
      {t('book.cta')}
      <ArrowRight className="w-5 h-5" />
    </motion.a>
  );
};

const BookSection = () => {
  const { t } = useT();
  const sectionRef = useRef(null);
  const [phraseIndex, setPhraseIndex] = useState(0);

  const phraseKeys = ['book.phrase1', 'book.phrase2', 'book.phrase3', 'book.phrase4', 'book.phrase5'];

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex(i => (i + 1) % phraseKeys.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "start start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [40, 0]);

  return (
    <section ref={sectionRef} className="pt-8 pb-10 px-4 relative z-30 bg-[#FDFCF8]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#E8E4D9_0%,_#FDFCF8_70%)]" />

      <div className="max-w-5xl mx-auto relative z-10 flex flex-col items-center">

        {/* Header */}
        <div className="text-center mb-4 md:mb-5">
          <h2 className="font-serif text-4xl md:text-6xl text-[#2D1B14] mb-3 italic">
            {t('book.title')}
          </h2>

          {/* Frases animadas */}
          <div className="relative h-8 md:h-10 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={phraseIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                className="absolute font-serif text-lg md:text-2xl text-[#2D1B14]/50 italic"
              >
                {t(phraseKeys[phraseIndex])}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Vídeo */}
        <motion.div
          style={{ opacity, y, filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.22))" }}
          className="w-full overflow-hidden rounded-2xl md:rounded-3xl"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto block"
          >
            <source src="/img-apoio/video-site-peregrino.mp4" type="video/mp4" />
          </video>
        </motion.div>

        {/* CTA */}
        <motion.div
          style={{ opacity, y }}
          className="mt-10 md:mt-14 flex flex-col items-center gap-4"
        >
          <OrderBookButton />
        </motion.div>

      </div>
    </section>
  );
};
