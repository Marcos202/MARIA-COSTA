import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { History, ArrowLeft, Loader2, AlertCircle, Search, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import type { FamilyMember } from '../types';
import { TimelineItem } from '../components/Timeline/TimelineItem';

export const TimelinePage = () => {
    const [allMembers, setAllMembers] = useState<FamilyMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                setLoading(true);
                // Buscamos todos para montar o lookup de nomes e filtrar os que têm birth_date para a timeline
                const { data, error: sbError } = await supabase
                    .from('family_members')
                    .select('*')
                    .order('birth_date', { ascending: true });

                if (sbError) throw sbError;

                setAllMembers(data || []);
            } catch (err: any) {
                console.error('Erro ao buscar membros:', err);
                setError('Não foi possível carregar a linha do tempo. Tente novamente mais tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, []);

    // Lookup de nomes para encontrar parentesco (Pai/Mãe)
    const memberLookup = useMemo(() => {
        const lookup: Record<string, string> = {};
        allMembers.forEach(m => {
            lookup[m.id] = m.name;
        });
        return lookup;
    }, [allMembers]);

    // Filtrar membros para a timeline
    const timelineMembers = useMemo(() => {
        return allMembers
            .filter(m => m.birth_date !== null)
            .filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [allMembers, searchTerm]);

    const oldestYear = useMemo(() => {
        if (allMembers.length === 0) return '---';
        const sorted = [...allMembers].filter(m => m.birth_date).sort((a, b) => (a.birth_date || '').localeCompare(b.birth_date || ''));
        return sorted[0]?.birth_date?.split('-')[0] || '---';
    }, [allMembers]);

    return (
        <div className="min-h-screen bg-offwhite pb-32">
            {/* Header com Design Refinado */}
            <header className="pt-16 pb-12 px-4 relative max-w-4xl mx-auto">
                <Link
                    to="/"
                    className="absolute left-4 top-8 p-2 text-stone-400 hover:text-rose-500 transition-colors bg-white rounded-full shadow-sm"
                    aria-label="Voltar para Início"
                >
                    <ArrowLeft size={20} />
                </Link>

                <div className="text-center mb-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center justify-center p-3 bg-rose-500 text-white rounded-2xl shadow-lg shadow-rose-200 mb-6"
                    >
                        <History size={32} />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-serif text-stone-800 mb-4"
                    >
                        Linhagem Familiar
                    </motion.h1>

                    {/* Estatísticas Rápidas */}
                    <div className="flex items-center justify-center gap-6 text-stone-400 font-medium text-xs md:text-sm uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <Users size={16} className="text-rose-400" />
                            <span>{allMembers.length} Membros</span>
                        </div>
                        <div className="w-1 h-1 bg-stone-300 rounded-full" />
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-rose-400" />
                            <span>Desde {oldestYear}</span>
                        </div>
                    </div>
                </div>

                {/* Barra de Busca */}
                <div className="relative max-w-md mx-auto">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search size={18} className="text-stone-300" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por nome..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-stone-600 font-sans"
                    />
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-1 md:px-4 relative mt-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="w-12 h-12 text-rose-500 animate-spin mb-4" />
                        <p className="text-stone-400 font-serif italic text-lg text-center">Reconstruindo as memórias da família...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="bg-red-50 p-4 rounded-full mb-6">
                            <AlertCircle className="w-12 h-12 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-serif text-stone-800 mb-2">Ops! Algo deu errado</h2>
                        <p className="text-stone-500 max-w-sm mx-auto mb-8 font-sans leading-relaxed">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-8 py-3 bg-stone-800 text-white rounded-xl hover:bg-black transition-all shadow-lg hover:shadow-xl font-medium"
                        >
                            Tentar Novamente
                        </button>
                    </div>
                ) : timelineMembers.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="bg-stone-100 p-6 rounded-full inline-block mb-6">
                            <Search size={48} className="text-stone-300" />
                        </div>
                        <p className="text-stone-400 font-serif italic text-xl">Nenhum familiar encontrado com este nome.</p>
                    </div>
                ) : (
                    <div className="relative">
                        {/* Linha Central - Agora centralizada inclusive no mobile */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 md:w-1.5 bg-rose-100/50 rounded-full" />

                        {/* Itens da Timeline */}
                        <div className="flex flex-col">
                            {timelineMembers.map((member, index) => (
                                <TimelineItem
                                    key={member.id}
                                    member={member}
                                    index={index}
                                    isLeft={index % 2 === 0}
                                    parentName={member.parent_id ? memberLookup[member.parent_id] : null}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Footer Final */}
            <footer className="mt-24 text-center">
                <div className="w-24 h-px bg-stone-200 mx-auto mb-8" />
                <p className="font-serif italic text-stone-300 text-lg">Um legado que atravessa gerações</p>
                <p className="text-stone-200 mt-2 text-xs uppercase tracking-[0.3em] font-sans">Maria Costa & Familia</p>
            </footer>
        </div>
    );
};
