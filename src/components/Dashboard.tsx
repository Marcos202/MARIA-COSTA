import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Lock, CheckCircle, RefreshCw } from 'lucide-react';
import { AdminFamilyTree } from './FamilyTree/AdminFamilyTree';

export const Dashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [lastSyncDate, setLastSyncDate] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showToast, setShowToast] = useState(false);

    // Simple hardcoded password for demo purposes
    const ADMIN_PASSWORD = "maria90anos";

    const fetchSyncDate = async () => {
        try {
            const { data, error } = await supabase
                .from('atualizacao')
                .select('ultima_atividade')
                .eq('id', 1)
                .single();

            if (!error && data) {
                setLastSyncDate(data.ultima_atividade);
            }
        } catch (err) {
            console.error('Erro ao buscar atualizacao:', err);
        }
    };

    const handleUpdateDatabase = async () => {
        setIsUpdating(true);
        try {
            const { error } = await supabase
                .from('atualizacao')
                .update({ ultima_atividade: new Date().toISOString() })
                .eq('id', 1);

            if (error) {
                console.error("Erro ao atualizar banco:", error);
                alert("Erro ao tentar atualizar o status do banco. Verifique sua conexão.");
            } else {
                await fetchSyncDate();
                setShowToast(true);
                setTimeout(() => setShowToast(false), 4000);
            }
        } catch (err) {
            console.error("Erro inesperado:", err);
        } finally {
            setIsUpdating(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchSyncDate();
        }
    }, [isAuthenticated]);

    const formatSyncDate = (isoString: string) => {
        try {
            const date = new Date(isoString);
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
        } catch {
            return isoString;
        }
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

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto relative">
            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-4 right-4 bg-green-50 text-green-700 px-5 py-3 rounded-xl shadow-lg border border-green-200 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 z-50">
                    <CheckCircle size={20} />
                    <span className="font-medium">Banco de dados atualizado com sucesso!</span>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-gray-100 pb-6">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-serif text-rosa-forte">Painel Administrativo</h1>

                    {/* Database Sync Button */}
                    <button
                        onClick={handleUpdateDatabase}
                        disabled={isUpdating}
                        className="group relative flex items-center gap-2 px-4 py-1.5 bg-white border border-stone-200 text-stone-600 rounded-full shadow-sm hover:border-rosa-antigo focus:outline-none focus:ring-2 focus:ring-rosa-claro transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                        title="Forçar atualização do banco para evitar pausa (Keep Alive)"
                    >
                        {isUpdating ? (
                            <RefreshCw size={14} className="text-rosa-forte animate-spin" />
                        ) : (
                            <CheckCircle size={14} className="text-green-500 group-hover:text-rosa-forte transition-colors" />
                        )}
                        <span className="text-xs font-semibold tracking-wide">
                            {isUpdating ? 'Atualizando...' : 'Sistema Ativo'}
                        </span>

                        {/* Tooltip */}
                        {lastSyncDate && !isUpdating && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 px-3 py-2 bg-stone-800 text-stone-100 text-[10px] md:text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none">
                                Última Sincronização: {formatSyncDate(lastSyncDate)}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-stone-800" />
                            </div>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content Area - Family Tree */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <AdminFamilyTree />
            </div>
        </div>
    );
};
