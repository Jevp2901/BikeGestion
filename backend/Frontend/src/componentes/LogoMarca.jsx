function LogoMarca({ subtitle = false, size = "md" }) {
  const textSize = size === "sm" ? "text-lg" : "text-2xl";

  return (
    <div className="leading-none">
      <div className={`font-headline font-black uppercase tracking-tight ${textSize}`}>
        <span className="text-white">BIKE</span>{" "}
        <span className="text-[#ffd700]">GESTIÓN</span>
      </div>
      {subtitle && (
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white">
          Software de Gestion
        </p>
      )}
    </div>
  );
}

export default LogoMarca;
