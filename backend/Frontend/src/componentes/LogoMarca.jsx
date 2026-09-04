function LogoMarca({ subtitle = false, size = "md", compact = false }) {
  const textSize = size === "sm" ? "text-lg" : "text-2xl";

  return (
    <div className={`flex items-center ${compact ? "justify-center" : "gap-3"}`}>
      <img src="/assets/logo-bicicleta.png" alt="Bike Gestión" className={`shrink-0 object-contain ${compact ? "h-10 w-10" : size === "sm" ? "h-10 w-10" : "h-14 w-14"}`} />
      {!compact && <div className="leading-none">
      <div className={`font-headline font-black uppercase tracking-tight ${textSize}`}>
        <span className="text-white">BIKE</span>{" "}
        <span className="text-[#ffd700]">GESTIÓN</span>
      </div>
      {subtitle && (
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white">
          Software de Gestion
        </p>
      )}
      </div>}
    </div>
  );
}

export default LogoMarca;
