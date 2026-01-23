import { useState } from 'react';
import { Menu, Lock, History, Network } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export const NavigationMenu = () => {
    const [isOpen, setIsOpen] = useState(false);


    return (
        <div className="fixed top-6 right-6 z-50 flex flex-col items-end print:hidden">
            {/* Botão Gatilho */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative z-50 p-1 text-stone-700 hover:text-rosa-forte hover:opacity-70 transition-all cursor-pointer focus:outline-none"
                aria-label="Menu Principal"
            >
                <Menu className="w-8 h-8" strokeWidth={1.5} />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg p-2 border border-gray-100 origin-top-right z-50"
                    >
                        <Link
                            to="/genealogica"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-rosa-claro/30 text-stone-600 hover:text-vinho transition-colors group text-left"
                            role="menuitem"
                        >
                            <div className="p-1.5 bg-gray-50 rounded-md group-hover:bg-white transition-colors text-vinho">
                                <Network size={16} />
                            </div>
                            <span className="text-sm font-medium">Árvore Genealógica</span>
                        </Link>

                        <Link
                            to="/linhagem"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-rosa-claro/30 text-stone-600 hover:text-vinho transition-colors group text-left"
                            role="menuitem"
                        >
                            <div className="p-1.5 bg-gray-50 rounded-md group-hover:bg-white transition-colors text-vinho">
                                <History size={16} />
                            </div>
                            <span className="text-sm font-medium">Linha do Tempo</span>
                        </Link>

                        <Link
                            to="/admin"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-rosa-claro/30 text-stone-600 hover:text-rosa-forte transition-colors group text-left"
                            role="menuitem"
                        >
                            <div className="p-1.5 bg-gray-50 rounded-md group-hover:bg-white transition-colors text-rosa-forte">
                                <Lock size={16} />
                            </div>
                            <span className="text-sm font-medium">Login</span>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Backdrop invisível para fechar ao clicar fora (opcional, mas boa prática UX) */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}
        </div>
    );
};
