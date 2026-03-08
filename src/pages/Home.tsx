import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { FirefliesBackground } from '../components/FirefliesBackground';

export const Home = () => {

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
                        Nossa Matriarca
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

                {/* 3. BASE: Navigation Buttons e Welcome Text */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="relative z-30 mt-4 w-full max-w-4xl mx-auto pb-12 flex flex-col items-center gap-8"
                >
                    <p className="text-xl md:text-2xl text-gray-700 max-w-lg mx-auto font-light leading-relaxed px-4 text-center mt-4 text-balance">
                        Bem-vindos ao portal de memórias e história da nossa família.
                    </p>

                    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 w-full px-4 mt-2">
                        <Link to="/genealogica" className="w-full sm:w-auto">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full group relative px-8 py-4 bg-rosa-forte text-white rounded-full text-lg font-medium shadow-xl hover:shadow-rosa-forte/40 transition-all inline-flex items-center justify-center gap-3 overflow-hidden cursor-pointer"
                            >
                                <span className="relative z-10 font-serif tracking-wider">
                                    Árvore Genealógica
                                </span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                            </motion.button>
                        </Link>

                        <Link to="/linhagem" className="w-full sm:w-auto">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full group relative px-8 py-4 bg-rosa-forte text-white rounded-full text-lg font-medium shadow-xl hover:shadow-rosa-forte/40 transition-all inline-flex items-center justify-center gap-3 overflow-hidden cursor-pointer"
                            >
                                <span className="relative z-10 font-serif tracking-wider">
                                    Linha do Tempo
                                </span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                            </motion.button>
                        </Link>

                        <Link to="/admin" className="w-full sm:w-auto">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full group relative px-8 py-4 bg-white/80 backdrop-blur-md text-rosa-forte border border-rosa-forte/20 rounded-full text-lg font-medium shadow-lg hover:shadow-rosa-forte/20 transition-all inline-flex items-center justify-center gap-3 overflow-hidden cursor-pointer"
                            >
                                <span className="relative z-10 font-serif tracking-wider">
                                    Login do Administrador
                                </span>
                                <div className="absolute inset-0 bg-rosa-forte/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                            </motion.button>
                        </Link>
                    </div>

                    <div className="h-6 md:h-12" />
                </motion.div>
            </header>

            {/* Footer */}
            <footer className="relative z-10 py-8 text-center text-gray-400 text-sm">
                <p>© 2025 Família Costa. Feito com amor.</p>
            </footer>
        </div>
    );
};
