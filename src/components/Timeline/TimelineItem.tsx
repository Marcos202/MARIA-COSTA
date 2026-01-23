import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronDown, ChevronUp, Quote } from 'lucide-react';
import { differenceInYears, parseISO } from 'date-fns';
import type { FamilyMember } from '../../types';

interface TimelineItemProps {
    member: FamilyMember;
    index: number;
    isLeft: boolean;
    parentName?: string | null;
}

export const TimelineItem = ({ member, index, isLeft, parentName }: TimelineItemProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const birthYear = member.birth_date ? member.birth_date.split('-')[0] : null;
    const deathYear = member.death_date ? member.death_date.split('-')[0] : null;

    const calculateAge = () => {
        if (!member.birth_date) return null;
        try {
            const birthDate = parseISO(member.birth_date);
            const endDate = member.death_date ? parseISO(member.death_date) : new Date();
            return differenceInYears(endDate, birthDate);
        } catch (e) {
            return null;
        }
    };

    const age = calculateAge();

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: (index % 6) * 0.1 }}
            className="relative flex items-center justify-center w-full min-h-[120px] mb-8 md:mb-16 group"
        >
            {/* O Ano no Eixo Central (Badge) */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-20">
                <div className="bg-rose-500 text-white text-[10px] md:text-sm font-bold w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                    {birthYear}
                </div>
            </div>

            {/* Layout Zigue-Zague Forçado (Mobile e Desktop) */}
            <div className={`w-full flex items-center px-1 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Lado do Card (46% para dar um pequeno respiro no centro) */}
                <div className="w-[46%] flex flex-col items-center">
                    <motion.div
                        layout
                        className={`
                            bg-white rounded-xl md:rounded-2xl shadow-md border border-gray-100 overflow-hidden w-full
                            hover:shadow-xl transition-all duration-300 relative
                            ${isLeft ? 'md:mr-2' : 'md:ml-2'}
                        `}
                    >
                        {/* Tags do Topo */}
                        <div className="px-2 pt-2 md:px-4 md:pt-3 flex flex-wrap gap-1 md:gap-2">
                            {member.role === 'patriarca' && (
                                <span className="bg-amber-100 text-amber-800 text-[8px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 rounded uppercase tracking-wider">
                                    Patriarca
                                </span>
                            )}
                            {member.role === 'matriarca' && (
                                <span className="bg-amber-100 text-amber-800 text-[8px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 rounded uppercase tracking-wider">
                                    Matriarca
                                </span>
                            )}
                            {member.is_deceased && (
                                <span className="bg-gray-100 text-gray-600 text-[8px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 rounded uppercase tracking-wider">
                                    In Memoriam
                                </span>
                            )}
                        </div>

                        {/* Conteúdo Principal */}
                        <div className={`p-2 md:p-4 flex flex-col md:flex-row items-center gap-2 md:gap-4 ${isLeft ? 'md:text-right md:flex-row-reverse' : 'md:text-left'}`}>
                            {/* Avatar */}
                            <div className="shrink-0">
                                <div className="w-12 h-12 md:w-20 md:h-20 rounded-full border-2 border-rose-100 overflow-hidden bg-rose-50 flex items-center justify-center shadow-inner">
                                    {member.photo_url ? (
                                        <img
                                            src={member.photo_url}
                                            alt={member.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-6 h-6 md:w-10 md:h-10 text-rose-300" />
                                    )}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 w-full min-w-0">
                                <h3 className="font-serif text-xs md:text-xl lg:text-2xl text-stone-800 truncate mb-0.5 md:mb-1">
                                    {member.name}
                                </h3>
                                <div className="text-[10px] md:text-sm text-rose-500 font-medium whitespace-nowrap">
                                    {member.is_deceased ? (
                                        <span>★ {birthYear} — ✝ {deathYear}</span>
                                    ) : (
                                        <span>{age} anos</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Citação curta ou descrição truncada */}
                        {member.description && !isExpanded && (
                            <div className="px-3 pb-2 md:px-4 md:pb-4">
                                <p className="text-[10px] md:text-sm text-stone-500 italic line-clamp-1">
                                    "{member.description}"
                                </p>
                            </div>
                        )}

                        {/* Detalhes Expandidos (AnimatePresence) */}
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="px-3 pb-3 md:px-4 md:pb-6 border-t border-gray-50 bg-stone-50/50"
                                >
                                    <div className="pt-3 md:pt-4 space-y-3">
                                        {/* Parentesco */}
                                        <div className="bg-white p-2 rounded-lg border border-gray-100">
                                            <p className="text-[8px] md:text-[10px] text-stone-400 uppercase font-bold tracking-widest mb-1">Parentesco</p>
                                            <p className="text-[10px] md:text-sm text-stone-700 font-medium">
                                                {parentName ? (
                                                    <>Filho(a) de <span className="text-rose-600 font-semibold">{parentName}</span></>
                                                ) : (
                                                    <span className="text-stone-400 italic">Raiz da linhagem</span>
                                                )}
                                            </p>
                                        </div>

                                        {/* Descrição Completa */}
                                        {member.description && (
                                            <div>
                                                <p className="text-[8px] md:text-[10px] text-stone-400 uppercase font-bold tracking-widest mb-1 flex items-center gap-1">
                                                    <Quote size={8} className="md:w-3 md:h-3" /> Sobre
                                                </p>
                                                <p className="text-[10px] md:text-sm text-stone-600 leading-relaxed italic">
                                                    {member.description}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Botão Ver Detalhes */}
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="w-full py-1.5 md:py-2 bg-stone-50 hover:bg-stone-100 text-stone-400 hover:text-stone-600 flex items-center justify-center gap-1 transition-colors text-[9px] md:text-xs font-semibold"
                        >
                            {isExpanded ? (
                                <><ChevronUp size={12} className="md:w-4 md:h-4" /> Recolher</>
                            ) : (
                                <><ChevronDown size={12} className="md:w-4 md:h-4" /> Ver detalhes</>
                            )}
                        </button>
                    </motion.div>
                </div>

                {/* Espaçador (Centro onde fica a linha) */}
                <div className="w-[8%] pointer-events-none" />

                {/* Lado Vazio (46%) */}
                <div className="w-[46%] pointer-events-none" />
            </div>
        </motion.div>
    );
};
