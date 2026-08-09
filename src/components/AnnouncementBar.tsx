const MESSAGES = [
  "Envío gratis a partir de $120.000",
  "3 y 6 cuotas sin interés",
  "Cambios y devoluciones sin cargo en 30 días",
];

export default function AnnouncementBar() {
  return (
    <div className="overflow-hidden bg-black py-2 text-white">
      <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-16">
        {[...MESSAGES, ...MESSAGES, ...MESSAGES].map((message, index) => (
          <span
            key={index}
            className="whitespace-nowrap text-[11px] uppercase tracking-widest-plus"
          >
            {message}
          </span>
        ))}
      </div>
    </div>
  );
}
