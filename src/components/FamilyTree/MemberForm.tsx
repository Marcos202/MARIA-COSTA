import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';
import type { FamilyMember } from '../../types';
import { Loader2, Upload, X, Instagram, Facebook, Phone, Crop as CropIcon, Check } from 'lucide-react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/cropImage';

interface MemberFormProps {
    member?: FamilyMember | null;
    onSuccess: () => void;
    onCancel: () => void;
    existingMembers: FamilyMember[];
}

export const MemberForm = ({ member, onSuccess, onCancel, existingMembers }: MemberFormProps) => {
    const [loading, setLoading] = useState(false);

    // Form States
    const [name, setName] = useState(member?.name || '');
    const [parentId, setParentId] = useState(member?.parent_id || '');
    const [description, setDescription] = useState(member?.description || '');
    // const [birthOrder, setBirthOrder] = useState(member?.birth_order?.toString() || '0'); // Deprecated
    const [birthDate, setBirthDate] = useState(member?.birth_date || '');
    const [isDeceased, setIsDeceased] = useState(member?.is_deceased || false);
    const [deathDate, setDeathDate] = useState(member?.death_date || '');
    const [role, setRole] = useState<'patriarca' | 'matriarca' | 'descendente'>(member?.role || 'descendente');

    const [instagram, setInstagram] = useState(member?.social_links?.instagram || '');
    const [whatsapp, setWhatsapp] = useState(member?.social_links?.whatsapp || '');
    const [facebook, setFacebook] = useState(member?.social_links?.facebook || '');
    const [photoUrl, setPhotoUrl] = useState(member?.photo_url || '');

    // Image Upload & Crop States
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isCropModalOpen, setIsCropModalOpen] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    // Initial Load
    useEffect(() => {
        if (member) {
            setName(member.name);
            setParentId(member.parent_id || '');
            setDescription(member.description || '');
            setBirthDate(member.birth_date || '');
            setIsDeceased(member.is_deceased || false);
            setDeathDate(member.death_date || '');
            setRole(member.role || 'descendente');
            setInstagram(member.social_links?.instagram || '');
            setWhatsapp(member.social_links?.whatsapp || '');
            setFacebook(member.social_links?.facebook || '');
            setPhotoUrl(member.photo_url || '');
        }
    }, [member]);

    // Handle File Selection
    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const imageDataUrl = await readFile(file);
            setSelectedImage(imageDataUrl as string);
            setIsCropModalOpen(true);
            setUploadError('');
            // Reset input value to allow re-selecting same file if needed
            e.target.value = '';
        }
    };

    const readFile = (file: File) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.addEventListener('load', () => resolve(reader.result));
            reader.readAsDataURL(file);
        });
    };

    const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleCancelCrop = () => {
        setIsCropModalOpen(false);
        setSelectedImage(null);
        setUploadError('');
        // Reset file input if needed is handled by finding the input element, but easier to just leave it as React state is cleared.
    };

    // Execute Crop & Upload
    const handleCropSave = async () => {
        if (!selectedImage || !croppedAreaPixels) return;

        try {
            setUploading(true);
            setUploadError('');

            // 1. Generate Blob from Crop
            const croppedBlob = await getCroppedImg(selectedImage, croppedAreaPixels);

            // 2. Prepare File Path
            // Organized structure: members/{uuid}/{timestamp}.jpg
            // NOTE: For new users, we don't have an ID yet. Using random string structure.
            const fileExt = 'jpg';
            const fileName = `member-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
            const filePath = `members/${fileName}`;

            // 3. Delete OLD image if exists (Garbage Collection)
            if (photoUrl) {
                const oldPath = photoUrl.split('/family-photos/')[1];
                if (oldPath) {
                    await supabase.storage.from('family-photos').remove([oldPath]);
                }
            }

            // 4. Upload NEW image
            const { error: uploadErr } = await supabase.storage
                .from('family-photos')
                .upload(filePath, croppedBlob, {
                    contentType: 'image/jpeg',
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadErr) {
                // Check specifically for "Bucket not found"
                if (uploadErr.message.includes('Bucket not found') || (uploadErr as any).statusCode === '404') {
                    throw new Error('Erro de configuração: O Bucket de imagens não existe. Contate o suporte.');
                }
                throw uploadErr;
            }

            // 5. Get Public URL
            const { data } = supabase.storage
                .from('family-photos')
                .getPublicUrl(filePath);

            setPhotoUrl(data.publicUrl);
            setIsCropModalOpen(false);
            setSelectedImage(null);

        } catch (error: any) {
            console.error('Error uploading:', error);
            setUploadError(error.message || 'Erro ao processar e salvar imagem.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Validation: Unique Root Member per Role
        if (role === 'patriarca' || role === 'matriarca') {
            const conflictingRoot = existingMembers.find(m =>
                m.role === role &&
                m.id !== member?.id
            );

            if (conflictingRoot) {
                alert(`Erro: Já existe um(a) ${role === 'patriarca' ? 'Patriarca' : 'Matriarca'} cadastrado: ${conflictingRoot.name}.`);
                return;
            }
        }

        setLoading(true);

        const memberData = {
            name,
            parent_id: parentId || null,
            role,
            description,
            birth_date: birthDate || null,
            is_deceased: isDeceased,
            death_date: isDeceased ? (deathDate || null) : null,
            photo_url: photoUrl,
            social_links: {
                instagram,
                whatsapp,
                facebook
            }
        };

        try {
            if (member?.id) {
                // Update
                const { error } = await supabase
                    .from('family_members')
                    .update(memberData)
                    .eq('id', member.id);
                if (error) throw error;
            } else {
                // Insert
                const { error } = await supabase
                    .from('family_members')
                    .insert([memberData]);
                if (error) throw error;
            }
            onSuccess();
        } catch (error) {
            console.error('Error saving member:', error);
            alert('Erro ao salvar membro. Verifique o console.');
        } finally {
            setLoading(false);
        }
    };

    // Filter root couple for the "Genearcas" option
    const patriarch = existingMembers.find(m => m.role === 'patriarca');
    const matriarch = existingMembers.find(m => m.role === 'matriarca');

    // Parent options excluding roots (handled separately) and self
    const descParentOptions = existingMembers.filter(m =>
        m.role === 'descendente' &&
        m.id !== member?.id
    );

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                            <input
                                required
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rosa-antigo outline-none"
                                placeholder="Ex: Maria Costa"
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="w-1/2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Papel na Família</label>
                                <select
                                    required
                                    value={role}
                                    onChange={(e) => setRole(e.target.value as any)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rosa-antigo outline-none bg-white"
                                >
                                    <option value="descendente">Descendente</option>
                                    <option value="patriarca">Patriarca (Fundador)</option>
                                    <option value="matriarca">Matriarca (Fundadora)</option>
                                </select>
                            </div>
                            <div className="w-1/2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Filho(a) de quem?</label>
                                <select
                                    disabled={role !== 'descendente'}
                                    value={parentId}
                                    onChange={(e) => setParentId(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rosa-antigo outline-none bg-white disabled:bg-gray-50 disabled:text-gray-400"
                                >
                                    <option value="">-- Raiz da Família --</option>
                                    {(patriarch || matriarch) && (
                                        <option value={patriarch?.id || matriarch?.id}>
                                            Genearcas (Raiz)
                                        </option>
                                    )}
                                    {descParentOptions.map((p) => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                            <input
                                type="date"
                                value={birthDate}
                                onChange={(e) => setBirthDate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rosa-antigo outline-none"
                            />
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <label className="flex items-center gap-2 cursor-pointer mb-2">
                                <input
                                    type="checkbox"
                                    checked={isDeceased}
                                    onChange={(e) => setIsDeceased(e.target.checked)}
                                    className="rounded text-rosa-forte focus:ring-rosa-forte"
                                />
                                <span className="text-sm font-medium text-gray-700">Falecido?</span>
                            </label>

                            {isDeceased && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Data de Falecimento</label>
                                    <input
                                        type="date"
                                        value={deathDate}
                                        onChange={(e) => setDeathDate(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rosa-antigo outline-none"
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Biografia Curta</label>
                            <textarea
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rosa-antigo outline-none resize-none"
                                placeholder="Conte um pouco sobre essa pessoa..."
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Photo Output Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Foto de Perfil</label>
                            <div className="flex items-center gap-4">
                                <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative group shadow-sm">
                                    {photoUrl ? (
                                        <>
                                            <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center transition-colors">
                                                <button
                                                    type="button"
                                                    onClick={() => setPhotoUrl('')}
                                                    className="text-white p-1 rounded-full hover:bg-white/20"
                                                    title="Remover foto"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <span className="text-gray-400 text-xs text-center px-1">Sem foto</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                        <Upload size={16} />
                                        {uploading ? 'Processando...' : 'Selecionar Imagem'}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={onFileChange}
                                            disabled={uploading}
                                        />
                                    </label>
                                    <p className="text-xs text-gray-400 mt-2">
                                        Recomendado: Você poderá cortar a imagem no próximo passo.
                                    </p>
                                    {uploadError && (
                                        <p className="text-xs text-red-500 mt-2 font-medium">{uploadError}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Social Links Form */}
                        <div className="border-t border-gray-100 pt-4 mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">Redes Sociais</label>

                            <div className="space-y-3">
                                <div className="relative">
                                    <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        value={instagram}
                                        onChange={(e) => setInstagram(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rosa-antigo outline-none text-sm"
                                        placeholder="Link do Instagram"
                                    />
                                </div>

                                <div className="relative">
                                    <Facebook className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        value={facebook}
                                        onChange={(e) => setFacebook(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rosa-antigo outline-none text-sm"
                                        placeholder="Link do Facebook"
                                    />
                                </div>

                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        value={whatsapp}
                                        onChange={(e) => setWhatsapp(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rosa-antigo outline-none text-sm"
                                        placeholder="Número WhatsApp (apenas números)"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="px-6 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading || uploading}
                        className="px-6 py-2 bg-rosa-forte text-white rounded-lg hover:bg-rosa-antigo font-medium transition-colors flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : 'Salvar Membro'}
                    </button>
                </div>
            </form>

            {/* Crop Modal */}
            {isCropModalOpen && selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl w-full max-w-lg overflow-hidden flex flex-col h-[500px] shadow-2xl">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                <CropIcon size={18} /> Editar Foto
                            </h3>
                            <button
                                onClick={handleCancelCrop}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="relative flex-1 bg-gray-900">
                            <Cropper
                                image={selectedImage}
                                crop={crop}
                                zoom={zoom}
                                aspect={1} // Square aspect ratio
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                                cropShape="round" // Visual helper for round crop
                                showGrid={false}
                            />
                        </div>

                        <div className="p-4 bg-white border-t border-gray-100 space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-gray-500 font-medium">Zoom</span>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rosa-forte"
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={handleCancelCrop}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleCropSave}
                                    disabled={uploading}
                                    className="px-6 py-2 bg-rosa-forte text-white rounded-lg hover:bg-rosa-antigo font-medium transition-colors text-sm flex items-center gap-2"
                                >
                                    {uploading ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                                    Confirmar Corte
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
