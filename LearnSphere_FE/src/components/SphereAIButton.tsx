type SphereAIButtonProps = {
  className?: string;
};

export function SphereAIButton({ className = '' }: SphereAIButtonProps) {
  return (
    <a
      href="/ai-assistant"
      className={`ai-assistant-pulse group fixed bottom-8 right-8 z-[100] flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/10 bg-[linear-gradient(135deg,#adc7ff,#24dfba)] text-[#002e68] shadow-2xl shadow-black/35 transition-transform active:scale-95 hover:scale-105 ${className}`}
      aria-label="Hỏi Sphere AI"
    >
      <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: '"FILL" 1' }}>
        psychology
      </span>
      <span className="pointer-events-none absolute bottom-full right-0 mb-4 whitespace-nowrap rounded-xl border border-white/5 bg-[#2f3542] px-4 py-2 font-mono text-[12px] text-[#dde2f4] opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
        Hỏi Sphere AI
      </span>
    </a>
  );
}
