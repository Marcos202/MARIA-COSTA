import { motion } from 'framer-motion';
import { MapPin, Heart, Home } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

interface SuccessViewProps {
    status: 'confirmed' | 'declined';
    onReset: () => void;
}

export const SuccessView = ({ status, onReset }: SuccessViewProps) => {
    useEffect(() => {
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
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center px-4 py-8"
        >
            {status === 'confirmed' ? (
                <div className="space-y-6">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-32 h-32 mx-auto rounded-full bg-rosa-claro p-2 shadow-lg"
                    >
                        <div className="w-full h-full rounded-full overflow-hidden border-2 border-white">
                            <img
                                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200"
                                alt="Maria"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </motion.div>

                    <h2 className="text-3xl font-serif text-rosa-forte">Que alegria!</h2>
                    <p className="text-gray-600">Sua presença foi confirmada. Será um prazer imenso ter você conosco neste dia tão especial.</p>

                    <div className="bg-white p-6 rounded-xl shadow-md border border-rosa-cha/30 mt-6 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rosa-antigo to-gold-light" />
                        <div className="flex items-center gap-3 text-left mb-2">
                            <MapPin className="text-rosa-forte" size={24} />
                            <div>
                                <h3 className="font-serif font-bold text-gray-800">Sítio Recanto das Flores</h3>
                                <p className="text-sm text-gray-500">Estrada Real, Km 12 - Zona Rural</p>
                            </div>
                        </div>
                        <a
                            href="https://maps.google.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 block w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                        >
                            Abrir no GPS
                        </a>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                        <Heart size={40} />
                    </div>
                    <h2 className="text-2xl font-serif text-gray-700">Agradecemos o aviso!</h2>
                    <p className="text-gray-600">Sentiremos sua falta, mas entendemos perfeitamente. Sua mensagem será entregue com muito carinho à Dona Maria.</p>
                </div>
            )}

            <button
                onClick={onReset}
                className="mt-12 text-sm text-gray-500 hover:text-rosa-forte underline decoration-rosa-cha underline-offset-4 flex items-center justify-center gap-2 mx-auto"
            >
                <Home size={16} /> Voltar ao início
            </button>
        </motion.div>
    );
};
