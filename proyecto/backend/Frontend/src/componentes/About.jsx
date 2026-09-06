import { Link } from 'react-router-dom';
import LogoMarca from './LogoMarca';
import '../App.css'

function About() {
    return (
        <div className="bg-[#050505] text-white selection:bg-yellow-500 selection:text-black min-h-screen">
            <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-5 bg-black/80 backdrop-blur-sm border-b border-white/10">
                <div className="flex items-center gap-4">
                    <LogoMarca subtitle />
                </div>
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/" className="font-headline uppercase tracking-[0.35em] text-sm text-white/70 hover:text-yellow-300 transition-colors duration-200">Home</Link>
                    <Link to="/about" className="font-headline uppercase tracking-[0.35em] text-sm text-yellow-300 border-b-2 border-yellow-200 pb-1">About</Link>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/registro" className="font-headline uppercase tracking-[0.35em] text-sm text-white/70 hover:text-yellow-300 transition-colors duration-200">Register</Link>
                    <Link to="/inicio_sesion" className="font-headline bg-yellow-300 text-black px-6 py-3 uppercase text-sm rounded-lg hover:opacity-90 active:scale-100 transition-all">Login</Link>
                </div>
            </nav>

            <main className="pt-22">
                <section className="relative min-h-[90vh] flex items-center overflow-hidden border-b border-white/10">
                    <div className="absolute inset-0 z-0">
                        <img
                            className="w-full h-full object-cover opacity-90"
                            alt="Bicicleta en taller oscuro"
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQH4y_GepJur9TpqT7yG-YG5X1cUMI2LP8TKg&s"
                        />
                        <div className="absolute inset-0 bg-black/70"></div>
                    </div>

                    <div className="relative z-10 container mx-auto px-8">
                        <div className="max-w-4xl">
                            <div className="mb-8 flex items-center gap-3">
                                <span className="w-12 h-1 bg-yellow-300 block"></span>
                                <span className="uppercase tracking-[0.35em] text-sm text-yellow-300">Software para tiendas de ciclismo</span>
                            </div>
                            <h1 className="text-5xl md:text-6xl xl:text-7xl italic font-extrabold leading-tight text-white mb-5 uppercase tracking-[-0.04em]">ACERCA DE <span className="text-yellow-300">NOSOTROS</span></h1>
                            <p className="max-w-2xl text-lg text-white/70">
                                Ingeniería de precisión aplicada a la gestión de ciclotalleres. No solo vendemos software; potenciamos el rendimiento de la industria del ciclismo en Bogotá.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="py-24 bg-black-950">
                    <div className="container mx-auto px-8">
                        <div className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
                            <article className="relative overflow-hidden rounded-4xl border border-white/10 bg-white/5 p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
                                <div className="absolute inset-0">
                                    <img
                                        className="h-full w-full object-cover opacity-30"
                                        alt="Bicicleta" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdW0d9N0DUioa_CXDx_MoP2F23OCp9NE3ZbJHflyJ8F9JdA8LajPUYnUMqiC-OpkBoof48n0iBezKPs1KrBSIj0hgOJQmLMzMICmX_C7biynbzYjrbQ9xYaN55SbxIIycLvQA3PpJrulZa46phwEqZPD7_CF7qwTfq47eyGE7KiKxwMODfHhpwDiHyt0sl_dEz1JtuSxeYDFpjyJJySFPZf3Voz7mhhml98HcGxpSU7Bq7VzbVvn8pof7aWyH0FH6j3I4H16UAm_I"
                                    />
                                    <div className="absolute inset-0 bg-black/70"></div>
                                </div>
                                <div className="relative z-10 max-w-2xl">
                                    <span className="inline-flex items-center gap-2 rounded-full border border-yellow-300 px-3 py-1 text-[11px] uppercase tracking-[0.35em] text-yellow-300">Nuestra Historia</span>
                                    <h2 className="mt-6 text-3xl font-extrabold uppercase tracking-[-0.03em] text-white">Nacimos para hacer más eficiente el ciclismo en Bogotá.</h2>
                                    <p className="mt-5 text-white/70 leading-relaxed text-sm">Nacidos de la pasión por el ciclismo y la necesidad de precisión absoluta en el comercio local. BikeGestión surgió en las rutas de Bogotá, observando que los mejores mecánicos y tiendas necesitaban herramientas a la altura de las máquinas que reparan.</p>
                                </div>
                            </article>

                            <div className="grid gap-6">
                                <article className="rounded-4xl border border-white/10 bg-[#111111] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
                                    <h3 className="mt-6 uppercase text-white text-sm tracking-[0.25em]">IMPACTO</h3>
                                    <p className="mt-4 text-white/70 text-sm leading-relaxed">Mejora la eficiencia y toma de decisiones en tu tienda, optimiza las ventas y compras a proveedores fácil y sencillo.</p>
                                </article>
                                <article className="rounded-4xl border border-white/10 bg-[#090909] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
                                    <h3 className="mt-6 uppercase text-white text-sm tracking-[0.25em]">EFICIENCIA</h3>
                                    <p className="mt-4 text-white/70 text-sm leading-relaxed">Flujos de trabajo optimizados para que pases menos tiempo en la pantalla y más en tu tienda.</p>
                                </article>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-6 md:grid-cols-3">
                            <article className="rounded-4xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] transition-all hover:border-yellow-300 hover:bg-white/10">
                                <h3 className="uppercase text-white text-sm tracking-[0.2em]">MISIÓN</h3>
                                <p className="mt-4 text-white/70 text-sm leading-relaxed">Este proyecto busca transformar la gestión de las tiendas de ciclismo en Bogotá con un software eficaz y fácil de manejar.</p>
                            </article>
                            <article className="rounded-4xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] transition-all hover:border-yellow-300 hover:bg-white/10">
                                <h3 className="uppercase text-white text-sm tracking-[0.2em]">EFICIENCIA</h3>
                                <p className="mt-4 text-white/70 text-sm leading-relaxed">Organiza ventas, inventario y proveedores desde una única plataforma.</p>
                            </article>
                            <article className="rounded-4xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] transition-all hover:border-yellow-300 hover:bg-white/10">
                                <h3 className="uppercase text-white text-sm tracking-[0.2em]">GESTIÓN</h3>
                                <p className="mt-4 text-white/70 text-sm leading-relaxed">Este software permite ver a todos los empleados y obtener reportes de inventario en tiempo real.</p>
                            </article>
                        </div>

                        <div className="mt-10 rounded-4xl border border-white/10 bg-white/5 p-10 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
                            <div className="max-w-3xl">
                                <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-[-0.03em] text-white">EL EQUIPO</h2>
                                <p className="mt-4 text-white/70 leading-relaxed">Somos aprendices de análisis y desarrollo de software de la ciudad de Bogotá y este equipo lo conforman cuatro personas en su formación tecnológica.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-20 border-t border-white/10 text-center">
                    <div className="container mx-auto px-8">
                        <h2 className="text-4xl md:text-5xl font-extrabold uppercase tracking-[0.2em] text-white mb-4">¿LISTO PARA ELEVAR EL NIVEL?</h2>
                        <p className="mx-auto max-w-2xl text-white/70 mb-8">Regístrate en nuestra página para iniciar esta experiencia fantástica.</p>
                        <Link to="/registro" className="inline-flex items-center justify-center rounded-full bg-yellow-300 px-10 py-4 text-sm font-bold uppercase tracking-[0.25em] text-black shadow-[0_0_30px_rgba(253,224,26,0.25)] hover:opacity-90 transition-opacity duration-200">Regístrate ahora</Link>
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

export default About;
