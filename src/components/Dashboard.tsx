import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Convidado } from '../types';
import { Users, UserMinus, Clock, Search, Lock } from 'lucide-react';

export const Dashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [convidados, setConvidados] = useState<Convidado[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Simple hardcoded password for demo purposes
    const ADMIN_PASSWORD = "maria90anos";

    useEffect(() => {
        if (isAuthenticated) {
            fetchConvidados();
        }
    }, [isAuthenticated]);

    const fetchConvidados = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('convidados')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching data:', error);
        } else {
            setConvidados(data || []);
        }
        setLoading(false);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
        } else {
            alert("Senha incorreta");
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 w-full max-w-md">
                    <div className="flex justify-center mb-4 text-rosa-forte">
                        <Lock size={32} />
                    </div>
                    <h2 className="text-2xl font-serif text-center mb-6 text-gray-800">Acesso Restrito</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            placeholder="Senha de administrador"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rosa-antigo focus:border-transparent outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="w-full bg-rosa-forte text-white py-2 rounded-lg hover:bg-rosa-antigo transition-colors"
                        >
                            Entrar
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const confirmados = convidados.filter(c => c.vai_comparecer);
    const recusados = convidados.filter(c => !c.vai_comparecer);

    const totalConfirmados = confirmados.reduce((acc, curr) => acc + 1 + (curr.qtd_acompanhantes || 0), 0);
    const totalTitulares = confirmados.length;

    const filteredConvidados = convidados.filter(c =>
        c.nome_completo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-serif text-rosa-forte">Painel Administrativo</h1>
                <button
                    onClick={fetchConvidados}
                    className="text-sm text-gray-500 hover:text-rosa-forte flex items-center gap-2"
                >
                    <Clock size={16} /> Atualizar dados
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-full">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Confirmados</p>
                            <h3 className="text-2xl font-bold text-gray-800">{totalConfirmados}</h3>
                            <p className="text-xs text-gray-400">({totalTitulares} convites)</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 text-red-600 rounded-full">
                            <UserMinus size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Recusas</p>
                            <h3 className="text-2xl font-bold text-gray-800">{recusados.length}</h3>
                        </div>
                    </div>
                </div>

                {/* Placeholder for Average Age calculation if desired later */}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
                    <h2 className="font-semibold text-gray-700">Lista de Convidados</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar nome..."
                            className="pl-9 pr-4 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-rosa-antigo"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3">Nome</th>
                                <th className="px-6 py-3">Idade</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Acompanhantes</th>
                                <th className="px-6 py-3">Mensagem</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Carregando...</td></tr>
                            ) : filteredConvidados.map((c) => (
                                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-3 font-medium text-gray-900">{c.nome_completo}</td>
                                    <td className="px-6 py-3 text-gray-500">{c.idade}</td>
                                    <td className="px-6 py-3">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.vai_comparecer
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {c.vai_comparecer ? 'Confirmado' : 'Recusado'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 text-gray-500">
                                        {c.vai_comparecer ? (
                                            <div>
                                                <span className="font-medium">{c.qtd_acompanhantes}</span>
                                                {c.nomes_acompanhantes && <p className="text-xs text-gray-400 truncate max-w-[150px]">{c.nomes_acompanhantes}</p>}
                                            </div>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-3 text-gray-500 max-w-xs truncate" title={c.mensagem_justificativa || ''}>
                                        {c.mensagem_justificativa || '-'}
                                    </td>
                                </tr>
                            ))}
                            {!loading && filteredConvidados.length === 0 && (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Nenhum registro encontrado.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
