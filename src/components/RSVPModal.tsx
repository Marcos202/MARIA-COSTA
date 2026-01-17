import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Loader2, Check, UserPlus } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface RSVPModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (status: 'confirmed' | 'declined') => void;
}

interface Guest {
    name: string;
    age: string;
}

export const RSVPModal = ({ isOpen, onClose, onSuccess }: RSVPModalProps) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Main form state
    const [nomeCompleto, setNomeCompleto] = useState('');
    const [idade, setIdade] = useState('');
    const [vaiComparecer, setVaiComparecer] = useState(true);
    const [mensagem, setMensagem] = useState('');
    const [frequenciaVisita, setFrequenciaVisita] = useState('');
    const [frequenciaError, setFrequenciaError] = useState(false);

    // Mapeamento de textos reflexivos por frequência
    const frequenciaTextos: Record<string, { texto: string; reflexao: string }> = {
        'Todo mês': {
            texto: 'Ver Maria todos os meses é um gesto de amor, honra e cuidado. Poucos têm esse privilégio. Sua presença transforma dias comuns em memórias que atravessam gerações.',
            reflexao: 'Presença é amor em forma de tempo. E o tempo que você oferece hoje se transforma em eternidade na memória.'
        },
        'Uma vez por ano': {
            texto: 'Visitar Maria apenas uma vez por ano significa que existe cerca de 33% de chance de não revê-la no próximo ano. Em outras palavras, a cada despedida, há uma possibilidade real de ela ser a última. O tempo não avisa quando decide encerrar um ciclo.',
            reflexao: 'O tempo não tira pessoas da nossa vida. Ele apenas revela quantas vezes deixamos para depois.'
        },
        'A cada 2 anos': {
            texto: 'Estatísticas indicam cerca de 50% de chance de não haver um novo reencontro. Isso significa que metade das pessoas dessa idade não chega ao próximo abraço. O "até a próxima" pode nunca chegar.',
            reflexao: 'Algumas ausências não são falta de amor, são excesso de adiamento.'
        },
        'Mais de 3 anos': {
            texto: 'Dados mostram que a chance de não vê-la novamente pode superar 60%. Estatisticamente, a ausência se torna mais provável que o reencontro. E algumas despedidas acontecem sem que a gente saiba que foram finais.',
            reflexao: 'O silêncio mais doloroso não é o da despedida, é o do arrependimento.'
        }
    };

    // Dynamic guests state
    const [guestCount, setGuestCount] = useState(0);
    const [guests, setGuests] = useState<Guest[]>([]);

    // Sync guests array when count changes
    useEffect(() => {
        setGuests(prev => {
            const currentLength = prev.length;
            if (guestCount > currentLength) {
                // Add new guests
                return [...prev, ...Array.from({ length: guestCount - currentLength }, () => ({ name: '', age: '' }))];
            } else if (guestCount < currentLength) {
                // Remove guests from the end
                return prev.slice(0, guestCount);
            }
            return prev;
        });
    }, [guestCount]);

    const handleGuestChange = (index: number, field: keyof Guest, value: string) => {
        const newGuests = [...guests];
        newGuests[index] = { ...newGuests[index], [field]: value };
        setGuests(newGuests);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation: Check if all guest names are filled
        if (vaiComparecer && guestCount > 0) {
            const missingNames = guests.some(g => !g.name.trim());
            if (missingNames) {
                alert("Por favor, informe o nome de todos os acompanhantes.");
                return;
            }
        }

        // Validation: Check if frequency is selected when not attending
        if (!vaiComparecer && !frequenciaVisita) {
            setFrequenciaError(true);
            return;
        }

        setLoading(true);

        try {
            // Format guest names: "Name (Age), Name (Age)"
            const formattedGuestNames = guests
                .map(g => {
                    const ageStr = g.age ? ` (${g.age} anos)` : '';
                    return `${g.name.trim()}${ageStr}`;
                })
                .join(', ');

            // Concatenar frequência de visita na mensagem (apenas quando não vai comparecer)
            let mensagemFinal = mensagem;
            if (!vaiComparecer && frequenciaVisita) {
                mensagemFinal = `${mensagem}\n\n[Frequência de visita: ${frequenciaVisita}]`;
            }

            const { error } = await supabase
                .from('convidados')
                .insert([{
                    nome_completo: nomeCompleto,
                    idade: idade ? parseInt(idade) : null,
                    vai_comparecer: vaiComparecer,
                    qtd_acompanhantes: vaiComparecer ? guestCount : 0,
                    nomes_acompanhantes: (vaiComparecer && guestCount > 0) ? formattedGuestNames : null,
                    mensagem_justificativa: mensagemFinal
                }]);

            if (error) throw error;



            // Navigate to confirmation page with status state
            window.scrollTo(0, 0);
            navigate('/confirmacao', { state: { status: vaiComparecer ? 'confirmed' : 'declined' } });

            // Optional: call original onSuccess if still needed for cleanup (though we are navigating away)
            onSuccess(vaiComparecer ? 'confirmed' : 'declined');
            resetForm();
            onClose();
        } catch (error) {
            console.error('Error submitting RSVP:', error);
            alert('Ocorreu um erro ao enviar sua confirmação. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setNomeCompleto('');
        setIdade('');
        setVaiComparecer(true);
        setMensagem('');
        setFrequenciaVisita('');
        setFrequenciaError(false);
        setGuestCount(0);
        setGuests([]);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rosa-antigo to-gold-light z-10" />

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors z-20"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-5 md:p-8 pt-8">
                            <h2 className="text-2xl font-serif text-rosa-forte mb-1">Confirmar Presença</h2>
                            <p className="text-gray-500 mb-6 text-sm">Por favor, preencha os detalhes abaixo.</p>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Campos Principais */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rosa-antigo focus:border-transparent outline-none transition-all"
                                            value={nomeCompleto}
                                            onChange={e => setNomeCompleto(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Sua Idade</label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rosa-antigo focus:border-transparent outline-none transition-all"
                                            value={idade}
                                            onChange={e => setIdade(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Poderá comparecer?</label>
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setVaiComparecer(true)}
                                                className={`w-full py-3 px-4 rounded-lg border transition-all font-medium ${vaiComparecer
                                                    ? 'bg-rosa-claro border-rosa-antigo text-rosa-forte'
                                                    : 'border-gray-200 text-gray-500 hover:border-rosa-cha'
                                                    }`}
                                            >
                                                Sim, irei!
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setVaiComparecer(false)}
                                                className={`w-full py-3 px-4 rounded-lg border transition-all font-medium ${!vaiComparecer
                                                    ? 'bg-gray-100 border-gray-400 text-gray-800'
                                                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                                    }`}
                                            >
                                                Infelizmente não
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Seção Condicional */}
                                <AnimatePresence mode="wait">
                                    {vaiComparecer ? (
                                        <motion.div
                                            key="attending"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden space-y-4"
                                        >
                                            <div className="pt-2 border-t border-gray-100">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Quantos acompanhantes? <span className="text-xs text-gray-400 font-normal">(Ex: marido, filhos)</span>
                                                </label>
                                                <div className="relative">
                                                    <UserPlus size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="10"
                                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rosa-antigo focus:border-transparent outline-none transition-all"
                                                        value={guestCount}
                                                        onChange={e => setGuestCount(Number(e.target.value))}
                                                    />
                                                </div>
                                            </div>

                                            {/* Renderização Dinâmica dos Acompanhantes */}
                                            <AnimatePresence>
                                                {guests.map((guest, index) => (
                                                    <motion.div
                                                        key={`guest-${index}`}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, scale: 0.9 }}
                                                        className="bg-gray-50 p-4 rounded-xl border border-gray-200"
                                                    >
                                                        <div className="flex items-center gap-2 mb-3 border-b border-gray-200/60 pb-2">
                                                            <div className="w-5 h-5 bg-rosa-antigo text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                                                                {index + 1}
                                                            </div>
                                                            <span className="text-sm font-medium text-rosa-forte">Acompanhante {index + 1}</span>
                                                        </div>

                                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                            <div className="sm:col-span-2">
                                                                <label className="block text-xs font-medium text-gray-500 mb-1">Nome Completo *</label>
                                                                <input
                                                                    type="text"
                                                                    required
                                                                    placeholder="Nome completo"
                                                                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-md focus:ring-1 focus:ring-rosa-antigo outline-none text-sm"
                                                                    value={guest.name}
                                                                    onChange={e => handleGuestChange(index, 'name', e.target.value)}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-500 mb-1">Idade</label>
                                                                <input
                                                                    type="number"
                                                                    placeholder="Opcional"
                                                                    className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-md focus:ring-1 focus:ring-rosa-antigo outline-none text-sm"
                                                                    value={guest.age}
                                                                    onChange={e => handleGuestChange(index, 'age', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="not-attending"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden space-y-4"
                                        >
                                            {/* Seção de Frequência de Visita - Radio Group Accordion */}
                                            <div className="pt-2 border-t border-gray-100">
                                                <label className={`block text-sm font-medium mb-3 transition-colors ${frequenciaError ? 'text-red-500' : 'text-gray-700'}`}>
                                                    Com que frequência você costuma ver a Maria Costa? <span className="text-rosa-forte">*</span>
                                                </label>

                                                <div className={`space-y-3 ${frequenciaError ? 'p-2 border border-red-200 rounded-xl bg-red-50/30' : ''}`}>
                                                    {['Todo mês', 'Uma vez por ano', 'A cada 2 anos', 'Mais de 3 anos'].map((opcao) => {
                                                        const isSelected = frequenciaVisita === opcao;

                                                        return (
                                                            <div key={opcao} className="flex flex-col">
                                                                <label
                                                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${isSelected
                                                                        ? 'bg-rosa-claro/30 border-rosa-antigo shadow-sm'
                                                                        : 'bg-white border-gray-200 hover:border-rosa-cha hover:bg-gray-50'
                                                                        }`}
                                                                >
                                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${isSelected
                                                                        ? 'border-rosa-forte'
                                                                        : 'border-gray-300'
                                                                        }`}>
                                                                        {isSelected && (
                                                                            <div className="w-2.5 h-2.5 rounded-full bg-rosa-forte" />
                                                                        )}
                                                                    </div>
                                                                    <input
                                                                        type="radio"
                                                                        name="frequenciaVisita"
                                                                        value={opcao}
                                                                        checked={isSelected}
                                                                        onChange={(e) => {
                                                                            setFrequenciaVisita(e.target.value);
                                                                            setFrequenciaError(false);
                                                                        }}
                                                                        className="sr-only"
                                                                    />
                                                                    <span className={`text-sm font-medium ${isSelected
                                                                        ? 'text-rosa-forte'
                                                                        : 'text-gray-600'
                                                                        }`}>
                                                                        {opcao}
                                                                    </span>
                                                                </label>

                                                                {/* Texto Reflexivo (Accordion) */}
                                                                <AnimatePresence>
                                                                    {isSelected && frequenciaTextos[opcao] && (
                                                                        <motion.div
                                                                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                                            animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                                                                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                                            transition={{ duration: 0.3 }}
                                                                            className="overflow-hidden px-1"
                                                                        >
                                                                            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-3 relative before:absolute before:top-[-6px] before:left-6 before:w-3 before:h-3 before:bg-stone-50 before:border-l before:border-t before:border-stone-200 before:rotate-45">
                                                                                <p className="text-sm text-stone-700 leading-relaxed">
                                                                                    {frequenciaTextos[opcao].texto}
                                                                                </p>
                                                                                <div className="border-t border-stone-200 pt-3">
                                                                                    <p className="text-sm italic text-rosa-forte font-medium leading-relaxed">
                                                                                        "{frequenciaTextos[opcao].reflexao}"
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* Mensagem de erro inline */}
                                                {frequenciaError && (
                                                    <motion.p
                                                        initial={{ opacity: 0, y: -5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1"
                                                    >
                                                        <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
                                                        Por favor, selecione uma opção para continuar.
                                                    </motion.p>
                                                )}
                                            </div>  {/* Campo de Mensagem */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Deixe uma mensagem para a Maria
                                                </label>
                                                <textarea
                                                    required
                                                    rows={3}
                                                    placeholder="Escreva algo especial para ela..."
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rosa-antigo focus:border-transparent outline-none transition-all resize-none"
                                                    value={mensagem}
                                                    onChange={e => setMensagem(e.target.value)}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <button
                                    disabled={loading}
                                    type="submit"
                                    className="w-full mt-6 bg-rosa-forte hover:bg-rosa-antigo text-white font-medium py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        <>
                                            Confirmar Envio
                                            <Check size={20} />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
