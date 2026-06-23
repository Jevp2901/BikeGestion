import { Link } from 'react-router-dom';
import LogoMarca from './LogoMarca';
import '../App.css'

function Home() {
    return (
        <div className="bg-[#050505] text-white selection:bg-yellow-500 selection:text-black">
            {/* <!-- Header / Navigation --> */}
            <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-5 bg-black/80 backdrop-blur-sm border-b border-white/10">
                <div className="flex items-center gap-4">
                    <LogoMarca subtitle />
                </div>
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/" className="font-headline uppercase tracking-[0.35em] text-sm text-yellow-300 border-b-2 border-yellow-200 pb-1">Home</Link>
                    <Link to="/about" className="font-headline uppercase tracking-[0.35em] text-sm text-white/70 hover:text-yellow-300 transition-colors duration-200">About</Link>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/registro" className="font-headline uppercase tracking-[0.35em] text-sm text-white/70 hover:text-yellow-300 transition-colors duration-200">Register</Link>
                    <Link to="/inicio_sesion" className="font-headline bg-yellow-300 text-black px-6 py-3 uppercase text-sm rounded-lg hover:opacity-90 active:scale-100 transition-all">Login</Link>
                </div>
            </nav>
            <main className="pt-22">
                {/* <!-- Hero Section --> */}
                <section className="relative min-h-[90vh] flex items-center overflow-hidden border-b border-white/10">
                    <div className="absolute inset-0 z-0">
                        <img
                            className="w-full h-full object-cover opacity-90"
                            alt="Bicicleta en taller oscuro"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdW0d9N0DUioa_CXDx_MoP2F23OCp9NE3ZbJHflyJ8F9JdA8LajPUYnUMqiC-OpkBoof48n0iBezKPs1KrBSIj0hgOJQmLMzMICmX_C7biynbzYjrbQ9xYaN55SbxIIycLvQA3PpJrulZa46phwEqZPD7_CF7qwTfq47eyGE7KiKxwMODfHhpwDiHyt0sl_dEz1JtuSxeYDFpjyJJySFPZf3Voz7mhhml98HcGxpSU7Bq7VzbVvn8pof7aWyH0FH6j3I4H16UAm_I"
                        />
                        <div className="absolute inset-0 bg-black/70"></div>
                    </div>
                    <div className="relative z-10 container mx-auto px-8">
                        <div className="max-w-4xl">
                            <div className="mb-8 flex items-center gap-3">
                                <span className="w-12 h-1 bg-yellow-300 block"></span>
                                <span className="uppercase tracking-[0.35em] text-sm text-yellow-300">Software para tiendas de ciclismo</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl xl:text-7xl italic font-extrabold leading-tight text-white mb-8 uppercase tracking-[-0.04em]">
                                EL SOFTWARE DE GESTIÓN PARA <br />
                                <span className="text-yellow-300">TIENDAS DE BICICLETAS EN BOGOTÁ</span>
                            </h1>
                            <p className="max-w-2xl text-lg text-white/70 mb-10">
                                Te ayudamos a gestionar tu tienda para evitar problemas futuros con tus principales clientes o proveedores.
                            </p>
                        </div>
                    </div>
                </section>
                {/* About Section */}
                <section className="py-24 bg-black-950 relative overflow-hidden">
                    <div className="container mx-auto px-8">
                        <div className="max-w-4xl mx-auto">
                            <span className="font-headline uppercase tracking-[0.35em] text-sm text-yellow-300 mb-4 block">Bikegestión</span>
                            <h2 className="text-4xl md:text-5xl italic uppercase text-white mb-10">Potenciando el ciclismo en Bogotá</h2>
                            <div className="space-y-6 text-white/70 text-lg leading-relaxed">
                                <p>BikeGestión es la herramienta de precisión diseñada específicamente para las necesidades únicas del mercado de ciclismo en Bogotá. Entendemos el dinamismo de las tiendas locales.</p>
                                <p>Nuestra plataforma consolida las operaciones críticas en un solo panel técnico, eliminando la fricción administrativa para que los tiendas bogotanos puedan enfocarse en su pasión y se eviten dolores de cabeza futuros.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                                <article className="rounded-4xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] transition-all hover:border-yellow-300 hover:bg-white/10">
                                    <svg className="w-9 h-9 mb-4 text-yellow-300" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19,0H5A5.006,5.006,0,0,0,0,5V6A3,3,0,0,0,1,8.234V19a5.006,5.006,0,0,0,5,5H18a5.006,5.006,0,0,0,5-5V8.234A3,3,0,0,0,24,6V5A5.006,5.006,0,0,0,19,0ZM2,5A3,3,0,0,1,5,2H19a3,3,0,0,1,3,3V6a1,1,0,0,1-1,1H3A1,1,0,0,1,2,6ZM21,19a3,3,0,0,1-3,3H6a3,3,0,0,1-3-3V9H21Z" />
                                        <path d="M9,14h6a1,1,0,0,0,0-2H9a1,1,0,0,0,0,2Z" />
                                    </svg>
                                    <h3 className="mt-5 uppercase text-white text-sm tracking-[0.2em]">GESTIÓN DE INVENTARIOS</h3>
                                    <p className="mt-4 text-white/70 leading-relaxed text-sm">Control total y preciso de cada componente y repuesto.</p>
                                </article>
                                <article className="rounded-4xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] transition-all hover:border-yellow-300 hover:bg-white/10">
                                    <svg className="w-9 h-9 mb-4 text-yellow-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 4h16v16H4z" />
                                        <path d="M8 8h8M8 12h8M8 16h5" />
                                    </svg>
                                    <h3 className="mt-5 uppercase text-white text-sm tracking-[0.2em]">COTIZACIONES ELECTRÓNICAS</h3>
                                    <p className="mt-4 text-white/70 leading-relaxed text-sm">Genera presupuestos técnicos profesionales al instante.</p>
                                </article>
                                <article className="rounded-4xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] transition-all hover:border-yellow-300 hover:bg-white/10">
                                    <svg className="w-9 h-9 mb-4 text-yellow-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
                                        <path d="M7 13l-1.5 7h13l-1.5-7" />
                                        <path d="M16 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM8 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
                                    </svg>
                                    <h3 className="mt-5 uppercase text-white text-sm tracking-[0.2em]">VENTAS</h3>
                                    <p className="mt-4 text-white/70 leading-relaxed text-sm">Terminal POS optimizado para la rapidez de tu tienda.</p>
                                </article>
                                <article className="rounded-4xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] transition-all hover:border-yellow-300 hover:bg-white/10">
                                    <svg className="w-9 h-9 mb-4 text-yellow-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 7h18v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                                        <path d="M3 11h18" />
                                        <path d="M8 4h8" />
                                    </svg>
                                    <h3 className="mt-5 uppercase text-white text-sm tracking-[0.2em]">COMPRAS Y PROVEEDORES</h3>
                                    <p className="mt-4 text-white/70 leading-relaxed text-sm">Gestiona el abastecimiento con tus aliados locales.</p>
                                </article>
                                <article className="rounded-4xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] transition-all hover:border-yellow-300 hover:bg-white/10">
                                    <svg className="w-9 h-9 mb-4 text-yellow-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" />
                                        <path d="M5.5 21s1-4 6.5-4 6.5 4 6.5 4" />
                                    </svg>
                                    <h3 className="mt-5 uppercase text-white text-sm tracking-[0.2em]">GESTIÓN DE EMPLEADOS</h3>
                                    <p className="mt-4 text-white/70 leading-relaxed text-sm">Control de rendimiento de mecánicos y vendedores.</p>
                                </article>
                                <article className="rounded-4xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] transition-all hover:border-yellow-300 hover:bg-white/10">
                                    <svg className="w-9 h-9 mb-4 text-yellow-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 20h16" />
                                        <path d="M5 16V8" />
                                        <path d="M10 16V11" />
                                        <path d="M15 16V13" />
                                        <path d="M20 16V9" />
                                        <path d="M4 4v16" />
                                    </svg>
                                    <h3 className="mt-5 uppercase text-white text-sm tracking-[0.2em]">REPORTES DE INVENTARIO</h3>
                                    <p className="mt-4 text-white/70 leading-relaxed text-sm">Analítica detallada para decisiones estratégicas.</p>
                                </article>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="w-full py-12 px-8 bg-[#080808] border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex flex-col items-center md:items-start gap-2">
                    <LogoMarca size="sm" />
                    <p className="font-headline text-white/60">© 2026 BikeGestión. Software de gestión.</p>
                </div>
            </footer>
        </div>
    )
}
export default Home
