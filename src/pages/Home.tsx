import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ChevronDown, ExternalLink } from 'lucide-react';

import { CountdownTimer } from '../components/CountdownTimer';
import { RSVPModal } from '../components/RSVPModal';
import { FirefliesBackground } from '../components/FirefliesBackground';

export const Home = () => {
    const [isRSVPOpen, setIsRSVPOpen] = useState(false);

    // Date of the event: 10 de Fevereiro de 2026
    const eventDate = new Date('2026-02-10T12:00:00');

    return (
        <div className="relative font-sans text-gray-800 selection:bg-rosa-cha selection:text-rosa-forte overflow-x-hidden">
            {/* Fireflies Effect */}
            <FirefliesBackground />

            {/* Hero Section */}
            <header className="relative z-10 flex flex-col items-center justify-start pt-16 md:pt-24 px-4 text-center">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-rosa-cha/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-light/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

                {/* 1. TOPO: Títulos (Antes da foto) */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-20 w-full max-w-4xl mx-auto mb-8"
                >
                    <span className="font-serif italic text-rosa-forte text-2xl md:text-3xl tracking-wide mb-2 block text-shadow-sm">
                        90 Anos
                    </span>
                    <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-gray-800 tracking-tight leading-none text-shadow-sm">
                        Maria Costa <br className="md:hidden" /> <span className="text-rosa-forte">de Jesus</span>
                    </h1>
                </motion.div>

                {/* 2. MEIO: Imagem Principal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, delay: 0.2 }}
                    className="relative w-full max-w-5xl mx-auto flex justify-center items-end"
                    style={{ height: '40vh', minHeight: '300px' }}
                >
                    <img
                        src="https://bxjjcfzfxzshzquuglmi.supabase.co/storage/v1/object/public/Fotos/foto%20maria%20costa%20de%20jesus.webp"
                        alt="Sra. Maria Costa"
                        className="w-full h-full object-contain object-bottom drop-shadow-2xl"
                    />
                </motion.div>

                {/* 3. BASE: Countdown, Texto e CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="relative z-30 -mt-10 w-full max-w-4xl mx-auto pb-12 flex flex-col items-center gap-6"
                >
                    {/* Countdown Timer com Container Glassmorphism */}
                    <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-4 md:p-6 shadow-2xl border border-white/50 inline-block">
                        <CountdownTimer targetDate={eventDate} />
                    </div>

                    {/* Descrição (Abaixo do Timer) */}
                    <p className="text-lg md:text-xl text-gray-600 max-w-lg mx-auto font-light leading-relaxed px-4 text-balance">
                        Confirme sua presença, informando se poderá estar conosco nesse momento especial.
                    </p>

                    {/* CTA Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsRSVPOpen(true)}
                        className="group relative px-10 py-5 bg-rosa-forte text-white rounded-full text-xl font-medium shadow-xl hover:shadow-rosa-forte/40 transition-all inline-flex items-center gap-3 overflow-hidden cursor-pointer mt-2"
                    >
                        <span className="relative z-10 flex items-center gap-2 font-serif tracking-wider">
                            Confirmar Presença <ChevronDown size={24} className="group-hover:translate-y-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    </motion.button>

                    <div className="h-6" />
                </motion.div>
            </header>

            {/* Location Section - Estilo Editorial Minimalista */}
            {/* Location Section - Estilo Editorial Minimalista */}
            <section className="relative z-10 py-24 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-6xl mx-auto flex flex-col items-center text-center"
                >
                    {/* Icon & Label */}
                    <div className="flex flex-col items-center mb-12">
                        <div className="text-rosa-forte mb-4">
                            <MapPin size={32} strokeWidth={1.5} />
                        </div>
                        <span className="text-sm font-sans tracking-[0.3em] text-gold-dark uppercase opacity-80">
                            Localização
                        </span>
                    </div>

                    {/* Grid de Eventos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                        {/* Evento 1: Sábado */}
                        <div className="flex flex-col items-center p-8 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/60 shadow-lg hover:shadow-xl transition-all">
                            <span className="inline-block px-4 py-1 rounded-full bg-rosa-cha/10 text-rosa-forte text-sm font-bold tracking-wide mb-6">
                                14/02 • SÁBADO • 19h
                            </span>
                            <h3 className="font-serif text-3xl md:text-4xl text-gray-800 mb-3 tracking-tight">
                                Espaço Garden Eventos
                            </h3>
                            <p className="text-lg text-stone-600 font-sans font-light mb-8 max-w-xs leading-relaxed">
                                Tucumã – PA
                            </p>
                            <a
                                href="https://maps.app.goo.gl/z42eB8HUwHMHM51HA"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative flex items-center gap-2 text-gray-800 font-sans tracking-wide text-sm border border-stone-300 px-6 py-2.5 rounded-full hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-all duration-300 ease-in-out"
                            >
                                Ver no Google Maps
                                <ExternalLink size={14} className="opacity-60 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100" />
                            </a>
                        </div>

                        {/* Evento 2: Domingo */}
                        <div className="flex flex-col items-center p-8 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/60 shadow-lg hover:shadow-xl transition-all">
                            <span className="inline-block px-4 py-1 rounded-full bg-rosa-cha/10 text-rosa-forte text-sm font-bold tracking-wide mb-6">
                                15/02 • DOMINGO • 12h
                            </span>
                            <h3 className="font-serif text-3xl md:text-4xl text-gray-800 mb-3 tracking-tight">
                                Sítio Nova Vida
                            </h3>
                            <p className="text-lg text-stone-600 font-sans font-light mb-8 max-w-xs leading-relaxed">
                                Vila Ladeira Vermelha, Pará
                            </p>
                            <a
                                href="https://maps.app.goo.gl/ZVbXYaFRqoQPygrUA"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative flex items-center gap-2 text-gray-800 font-sans tracking-wide text-sm border border-stone-300 px-6 py-2.5 rounded-full hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-all duration-300 ease-in-out"
                            >
                                Ver no Google Maps
                                <ExternalLink size={14} className="opacity-60 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100" />
                            </a>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-8 text-center text-gray-400 text-sm">
                <p>© 2025 Família Costa. Feito com amor.</p>
            </footer>

            <RSVPModal
                isOpen={isRSVPOpen}
                onClose={() => setIsRSVPOpen(false)}
                // onSuccess is handled internally via navigation now
                onSuccess={() => setIsRSVPOpen(false)}
            />
        </div>
    );
};
