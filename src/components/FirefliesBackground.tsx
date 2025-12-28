import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface Firefly {
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
    color: string;
}

export const FirefliesBackground = () => {
    // Gerar vagalumes com posições e propriedades aleatórias
    const fireflies = useMemo<Firefly[]>(() => {
        const colors = ['#FFD700', '#FFA500', '#FFECB3', '#FFF8DC'];
        return Array.from({ length: 25 }, (_, i) => ({
            id: i,
            x: Math.random() * 100, // Porcentagem da largura
            y: Math.random() * 100, // Porcentagem da altura
            size: Math.random() * 3 + 2, // 2px a 5px
            duration: Math.random() * 10 + 10, // 10s a 20s
            delay: Math.random() * 5, // Delay inicial aleatório
            color: colors[Math.floor(Math.random() * colors.length)],
        }));
    }, []);

    return (
        <div className="fixed inset-0 w-full h-full max-w-full z-0 pointer-events-none overflow-hidden">
            {fireflies.map((firefly) => (
                <motion.div
                    key={firefly.id}
                    className="absolute rounded-full"
                    style={{
                        left: `${firefly.x}%`,
                        top: `${firefly.y}%`,
                        width: `${firefly.size}px`,
                        height: `${firefly.size}px`,
                        backgroundColor: firefly.color,
                        boxShadow: `0 0 ${firefly.size * 3}px ${firefly.color}, 0 0 ${firefly.size * 6}px ${firefly.color}`,
                        filter: 'blur(0.5px)',
                    }}
                    animate={{
                        // Movimento flutuante (floating)
                        x: [0, Math.random() * 40 - 20, 0],
                        y: [0, Math.random() * 40 - 20, 0],
                        // Piscada (twinkle)
                        opacity: [0.2, 0.8, 0.3, 0.7, 0.2],
                        scale: [1, 1.2, 0.9, 1.1, 1],
                    }}
                    transition={{
                        duration: firefly.duration,
                        delay: firefly.delay,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    );
};
