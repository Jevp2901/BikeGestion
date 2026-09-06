import "../App.css";

function ModulePlaceholder({
  eyebrow,
  title,
  description,
  icon,
  primaryActionLabel,
  secondaryActionLabel,
  highlights = [],
}) {
  return (
    <div className="space-y-6 text-white">
      <section className="overflow-hidden rounded-2xl border border-[#1f2020] bg-[#0d0e0f] shadow-[0_0_0_1px_rgba(255,215,0,0.04)]">
        <div className="relative border-b border-[#1f2020] px-6 py-6 md:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,215,0,0.12),transparent_40%)]" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.35em] text-[#d0c6ab]">
                {eyebrow}
              </p>
              <h1 className="text-3xl font-black uppercase tracking-[-0.04em] text-[#e3e2e2] md:text-4xl">
                {title}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#d0c6ab] md:text-base">
                {description}
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-[#333333] bg-[#121212] px-4 py-3">
              <span className="material-symbols-outlined text-[#ffd700]">{icon}</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d0c6ab]">
                  Base visual
                </p>
                <p className="text-sm font-semibold text-[#e3e2e2]">Próximamente</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3 md:p-8">
          {highlights.map((item) => (
            <article
              key={item}
              className="rounded-2xl border border-[#1f2020] bg-[#0a0a0a] p-5 transition-colors hover:border-[#ffd700]/50"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-[#333333] bg-[#121212] text-[#ffd700]">
                <span className="material-symbols-outlined text-lg">bolt</span>
              </div>
              <p className="text-sm leading-6 text-[#e3e2e2]">{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-[#1f2020] bg-[#0d0e0f] p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-[#d0c6ab]">
              Estado del módulo
            </h2>
            <span className="rounded-full border border-[#ffd700]/20 bg-[#ffd700]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#ffd700]">
              En desarrollo
            </span>
          </div>
          <div className="space-y-4 text-sm leading-6 text-[#d0c6ab]">
            <p>
              Esta pantalla conserva la misma identidad visual que el resto del panel:
              fondo oscuro, tarjetas limpias, bordes suaves y acentos dorados.
            </p>
            <p>
              Cuando el backend y el esquema de datos estén listos, podremos reemplazar
              este contenido sin cambiar la estructura principal.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-[#1f2020] bg-[#0d0e0f] p-6">
          <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-[#d0c6ab]">
            Acciones
          </h2>
          <div className="mt-5 space-y-3">
            <button
              type="button"
              className="w-full rounded-xl bg-[#ffd700] px-4 py-3 text-sm font-bold uppercase tracking-[0.25em] text-[#221b00] transition-colors hover:bg-[#ffe16d]"
            >
              {primaryActionLabel}
            </button>
            <button
              type="button"
              className="w-full rounded-xl border border-[#333333] bg-[#121212] px-4 py-3 text-sm font-bold uppercase tracking-[0.25em] text-[#e3e2e2] transition-colors hover:border-[#ffd700]/50 hover:text-[#ffd700]"
            >
              {secondaryActionLabel}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ModulePlaceholder;
