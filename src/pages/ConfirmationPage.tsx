import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Heart, Home as HomeIcon, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ConfirmationPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const status = state?.status || 'confirmed'; // Default to confirmed if accessed directly for demo, or handle error

    useEffect(() => {
        // Scroll to top on mount
        window.scrollTo(0, 0);

        if (status === 'confirmed') {
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval = window.setInterval(() => {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 50 * (timeLeft / duration);
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
                });
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
                });
            }, 250);

            return () => clearInterval(interval);
        }
    }, [status]);

    return (
        <div className="min-h-screen bg-offwhite flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Texture */}
            <div className="fixed inset-0 pointer-events-none opacity-40 mix-blend-multiply bg-paper-texture z-0" />

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-rosa-cha/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-light/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl border border-white max-w-lg w-full text-center relative z-10"
            >
                {status === 'confirmed' ? (
                    <>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                            className="w-24 h-24 mx-auto rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-6 shadow-sm"
                        >
                            <CheckCircle size={48} strokeWidth={3} />
                        </motion.div>

                        <h1 className="text-3xl md:text-4xl font-serif text-rosa-forte mb-4">Que alegria!</h1>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Sua presença está confirmada.<br />
                            Será um prazer imenso ter você conosco neste dia tão especial para a <span className="font-serif italic text-rosa-forte">Dona Maria</span>.
                        </p>

                        <div className="space-y-4 mb-8">
                            {/* Card Evento 1 */}
                            <div className="bg-gradient-to-br from-white to-gray-50 p-5 rounded-2xl border border-rosa-cha/30 shadow-sm text-left relative overflow-hidden group hover:border-rosa-antigo transition-colors">
                                <div className="absolute top-0 left-0 w-1 h-full bg-rosa-forte" />
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-white rounded-lg shadow-sm text-rosa-forte shrink-0">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <span className="block text-xs font-bold text-rosa-forte uppercase tracking-wider mb-1 opacity-90">
                                            14/02 • Sábado • 19h
                                        </span>
                                        <h3 className="font-serif font-bold text-gray-800 text-lg leading-tight mb-1">Espaço Garden Eventos</h3>
                                        <p className="text-gray-500 text-sm mb-3">Tucumã – PA</p>
                                        <a
                                            href="https://maps.app.goo.gl/z42eB8HUwHMHM51HA"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-xs font-bold text-gray-600 hover:text-rosa-forte uppercase tracking-wider hover:underline transition-colors gap-1"
                                        >
                                            Ver no Mapa
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Card Evento 2 */}
                            <div className="bg-gradient-to-br from-white to-gray-50 p-5 rounded-2xl border border-rosa-cha/30 shadow-sm text-left relative overflow-hidden group hover:border-rosa-antigo transition-colors">
                                <div className="absolute top-0 left-0 w-1 h-full bg-rosa-forte" />
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-white rounded-lg shadow-sm text-rosa-forte shrink-0">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <span className="block text-xs font-bold text-rosa-forte uppercase tracking-wider mb-1 opacity-90">
                                            15/02 • Domingo • 12h
                                        </span>
                                        <h3 className="font-serif font-bold text-gray-800 text-lg leading-tight mb-1">Sítio Nova Vida</h3>
                                        <p className="text-gray-500 text-sm mb-3">Vila Ladeira Vermelha, Pará</p>
                                        <a
                                            href="https://maps.app.goo.gl/ZVbXYaFRqoQPygrUA"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-xs font-bold text-gray-600 hover:text-rosa-forte uppercase tracking-wider hover:underline transition-colors gap-1"
                                        >
                                            Ver no Mapa
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                            className="w-24 h-24 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-6"
                        >
                            <Heart size={48} />
                        </motion.div>
                        <h1 className="text-3xl md:text-4xl font-serif text-gray-700 mb-4">Agradecemos o aviso!</h1>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Sentiremos sua falta, mas entendemos perfeitamente.<br />
                            Sua mensagem será entregue com muito carinho.
                        </p>
                    </>
                )}

                <button
                    onClick={() => navigate('/')}
                    className="w-full bg-rosa-forte hover:bg-rosa-antigo text-white font-medium py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                    <HomeIcon size={20} />
                    Voltar ao Início
                </button>
            </motion.div>
        </div>
    );
};
