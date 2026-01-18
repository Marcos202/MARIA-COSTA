import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { FamilyMember } from '../../types';
import { MemberForm } from './MemberForm';
import { Plus, Edit2, Trash2, Search, User } from 'lucide-react';

export const AdminFamilyTree = () => {
    const [members, setMembers] = useState<FamilyMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('family_members')
                .select('*')
                .order('name');

            if (error) throw error;
            setMembers(data || []);
        } catch (error) {
            console.error('Error fetching members:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (member: FamilyMember) => {
        if (!window.confirm(`Tem certeza que deseja remover ${member.name}? Se ele(a) tiver filhos, a árvore pode quebrar.`)) return;

        try {
            // 1. Delete Photo from Storage if exists
            if (member.photo_url) {
                const relativePath = member.photo_url.split('/family-photos/')[1];
                if (relativePath) {
                    const { error: storageError } = await supabase.storage
                        .from('family-photos')
                        .remove([relativePath]);

                    if (storageError) console.error('Error deleting photo:', storageError);
                }
            }

            // 2. Delete Record
            const { error } = await supabase
                .from('family_members')
                .delete()
                .eq('id', member.id);

            if (error) throw error;
            setMembers(prev => prev.filter(m => m.id !== member.id));
        } catch (error) {
            console.error('Error deleting member:', error);
            alert('Erro ao excluir membro.');
        }
    };

    const handleEdit = (member: FamilyMember) => {
        setSelectedMember(member);
        setIsEditing(true);
    };

    const handleAddNew = () => {
        setSelectedMember(null);
        setIsEditing(true);
    };

    const handleSuccess = () => {
        setIsEditing(false);
        fetchMembers();
    };

    const filteredMembers = members.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Helper to find parent name
    const getParentName = (member: FamilyMember) => {
        if (member.role === 'patriarca' || member.role === 'matriarca') return '- FUNDADOR(A) -';
        if (!member.parent_id) return 'Genearcas (Raiz)';
        const parent = members.find(m => m.id === member.parent_id);
        if (parent?.role === 'patriarca' || parent?.role === 'matriarca') return 'Genearcas (Raiz)';
        return parent?.name || 'Desconhecido';
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-xl font-serif text-gray-800">Gestão da Árvore Genealógica</h2>
                    <p className="text-sm text-gray-500">Cadastre os membros da família e suas conexões.</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={handleAddNew}
                        className="bg-rosa-forte text-white px-4 py-2 rounded-lg hover:bg-rosa-antigo transition-colors flex items-center gap-2"
                    >
                        <Plus size={18} /> Novo Membro
                    </button>
                )}
            </div>

            <div className="p-6">
                {isEditing ? (
                    <div className="max-w-4xl mx-auto">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="font-medium text-lg text-gray-700">
                                {selectedMember ? `Editar ${selectedMember.name}` : 'Adicionar Novo Membro'}
                            </h3>
                        </div>
                        <MemberForm
                            member={selectedMember}
                            existingMembers={members}
                            onSuccess={handleSuccess}
                            onCancel={() => setIsEditing(false)}
                        />
                    </div>
                ) : (
                    <>
                        <div className="mb-6 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar membro por nome..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-rosa-antigo"
                            />
                        </div>

                        {loading ? (
                            <div className="text-center py-12 text-gray-500">Carregando membros...</div>
                        ) : filteredMembers.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-lg text-gray-500">
                                Nenhum membro encontrado. Adicione o primeiro patriarca!
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-sm font-medium text-gray-500">
                                            <th className="py-3 px-4">Membro</th>
                                            <th className="py-3 px-4">Filho de</th>
                                            <th className="py-3 px-4 text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredMembers.map(member => (
                                            <tr key={member.id} className="hover:bg-gray-50 transition-colors group">
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                                            {member.photo_url ? (
                                                                <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                    <User size={20} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span className="font-medium text-gray-800">{member.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4 text-gray-600 text-sm">
                                                    {getParentName(member)}
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleEdit(member)}
                                                            className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                                            title="Editar"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(member)}
                                                            className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                                            title="Excluir"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
