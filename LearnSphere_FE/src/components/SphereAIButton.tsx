type SphereAIButtonProps = {
  className?: string;
};

export function SphereAIButton({ className = '' }: SphereAIButtonProps) {
  return (
    <a
      href="/ai-assistant"
      className={`group fixed bottom-8 right-8 z-[100] flex items-center gap-3 rounded-full bg-[#adc7ff] px-5 py-3 text-[#002e68] shadow-2xl shadow-black/30 transition-transform active:scale-95 hover:scale-105 ${className}`}
      aria-label="Hỏi Sphere AI"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full text-[#002e68]">
        <span className="material-symbols-outlined text-[30px]" style={{ fontVariationSettings: '"FILL" 1' }}>
          smart_toy
        </span>
      </span>
      <span className="flex flex-col items-start leading-none">
        <span className="text-[16px] font-bold">Hỏi Sphere AI</span>
        <span className="mt-1 text-[11px] font-medium uppercase tracking-wider opacity-80">Trợ lý</span>
      </span>
    </a>
  );
}
