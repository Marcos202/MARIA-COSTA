import { useState, useCallback, useEffect } from 'react';
import { ReactFlow, Controls, Background, useNodesState, useEdgesState, ConnectionLineType, Handle, Position, type Node, type Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { supabase } from '../lib/supabaseClient';
import type { FamilyMember } from '../types';
import { FamilyNode } from '../components/FamilyTree/FamilyNode';
import { X, Instagram, Facebook, Phone, Loader2, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const nodeTypes = {
    familyMember: FamilyNode,
    union: () => (
        <div className="flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-full shadow-md border border-rosa-cha flex items-center justify-center text-red-500 text-lg z-20">
                ❤️
            </div>
            {/* Horizontal connection line for the couple - matching gap of 160*2 = 320 */}
            <div className="absolute w-[320px] h-[2px] bg-rosa-cha/50 -z-10" />
            <Handle type="target" position={Position.Top} className="!opacity-0" />
            <Handle type="source" position={Position.Bottom} className="!top-1/2 !bg-rosa-forte" />
        </div>
    )
};

// Dagre Layout Setup
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 150;
const nodeHeight = 150;

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
    dagreGraph.setGraph({ rankdir: 'TB', nodesep: 70, ranksep: 120 });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        return {
            ...node,
            position: {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            },
        };
    });

    return { nodes: layoutedNodes, edges };
};

export const GenealogyPage = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

    useEffect(() => {
        fetchFamilyData();
    }, []);

    const fetchFamilyData = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('family_members')
                .select('*')
                .order('name'); // Or birth_date

            if (error) throw error;
            if (!data) return;

            // 1. Identify Root Couple
            const patriarch = data.find(m => m.role === 'patriarca');
            const matriarch = data.find(m => m.role === 'matriarca');

            const hasCouple = patriarch && matriarch;
            const unionId = 'genearcas-union';

            // 2. Build Nodes
            const rawNodes: Node[] = data.map((member) => ({
                id: member.id,
                type: 'familyMember',
                data: {
                    label: member.name.split(' ').slice(0, 2).join(' '),
                    photo_url: member.photo_url,
                    is_deceased: member.is_deceased,
                    role: member.role,
                    originalData: member
                },
                position: { x: 0, y: 0 },
            }));

            // Add Union Node if couple exists
            if (hasCouple) {
                rawNodes.push({
                    id: unionId,
                    type: 'union',
                    data: { label: '❤️' },
                    position: { x: 0, y: 0 },
                });
            }

            // 3. Build Edges
            const rawEdges: Edge[] = [];

            data.forEach(m => {
                if (m.parent_id) {
                    // Logic: If parent is one of the Genearcas, connect CHILD to the UNION node
                    const isFromRoot = hasCouple && (m.parent_id === patriarch.id || m.parent_id === matriarch.id);

                    rawEdges.push({
                        id: `e-${m.parent_id}-${m.id}`,
                        source: isFromRoot ? unionId : m.parent_id!,
                        target: m.id,
                        type: 'smoothstep',
                        animated: false,
                        style: { stroke: '#be185d', strokeWidth: 2 }, // Stronger line for hierarchy
                    });
                }
            });

            // Layout
            const { nodes: dagreLayoutedNodes, edges: layoutedEdges } = getLayoutedElements(rawNodes, rawEdges);

            // Manual adjustment for the couple to ensure perfect symmetry and centering
            let finalNodes = dagreLayoutedNodes;
            if (hasCouple) {
                const uNodeInDagre = dagreLayoutedNodes.find(n => n.id === unionId);

                if (uNodeInDagre) {
                    const centerX = uNodeInDagre.position.x + nodeWidth / 2; // Center axis of the tree
                    const baseY = 50;
                    const gap = 160; // Half-distance between founders centers

                    finalNodes = dagreLayoutedNodes.map(node => {
                        if (node.id === patriarch.id) {
                            return { ...node, position: { x: centerX - gap - nodeWidth / 2, y: baseY } };
                        }
                        if (node.id === matriarch.id) {
                            return { ...node, position: { x: centerX + gap - nodeWidth / 2, y: baseY } };
                        }
                        if (node.id === unionId) {
                            // Center the 32x32 heart node at centerX
                            return { ...node, position: { x: centerX - 16, y: baseY + nodeHeight / 2 - 16 } };
                        }
                        return node;
                    });
                }
            }

            setNodes(finalNodes);
            setEdges(layoutedEdges);

        } catch (error) {
            console.error('Error loading tree:', error);
        } finally {
            setLoading(false);
        }
    };

    const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
        if (node.type === 'familyMember') {
            setSelectedMember(node.data.originalData as FamilyMember);
        }
    }, []);

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return null;
        try {
            const [year, month, day] = dateStr.split('-');
            return `${day}/${month}/${year}`;
        } catch (e) {
            return dateStr;
        }
    };

    if (loading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-offwhite text-rosa-forte">
                <Loader2 size={48} className="animate-spin mb-4" />
                <p className="font-serif text-lg">Carregando história da família...</p>
            </div>
        );
    }

    return (
        <div className="h-screen w-full bg-offwhite relative font-sans">
            {/* Header Voltar */}
            <div className="absolute top-4 left-4 z-10">
                <Link to="/" className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-sm text-rosa-forte font-bold flex items-center gap-2 hover:bg-rosa-forte hover:text-white transition-colors">
                    <Home size={20} />
                    <span className="hidden sm:inline">Voltar ao Início</span>
                </Link>
            </div>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                connectionLineType={ConnectionLineType.SmoothStep}
                fitView
                className="bg-paper-pattern"
                minZoom={0.2}
                maxZoom={1.5}
            >
                <Background color="#e5e7eb" gap={20} size={1} />
                <Controls className='!bg-white !border-gray-200 !shadow-lg [&>button]:!text-gray-600 [&>button:hover]:!bg-gray-50' />
            </ReactFlow>

            {/* Details Modal */}
            {selectedMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedMember(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden relative animate-in zoom-in-95 duration-300 border border-white/50" onClick={e => e.stopPropagation()}>
                        {/* Botão Fechar */}
                        <button
                            onClick={() => setSelectedMember(null)}
                            className="absolute top-3 right-3 p-2 bg-black/10 hover:bg-black/20 text-white rounded-full z-10 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {/* Imagem de Capa/Perfil */}
                        <div className="h-64 w-full bg-rosa-cha/30 relative flex items-center justify-center overflow-hidden">
                            {selectedMember.photo_url ? (
                                <img
                                    src={selectedMember.photo_url}
                                    alt={selectedMember.name}
                                    className={`w-full h-full object-cover ${selectedMember.is_deceased ? 'grayscale' : ''}`}
                                />
                            ) : (
                                <div className="text-rosa-forte/50">
                                    <Loader2 size={48} className="animate-spin" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute bottom-6 inset-x-0 px-6 text-white text-center flex flex-col items-center z-10">
                                <h2
                                    className={`font-serif font-bold leading-tight drop-shadow-md ${selectedMember.name.length > 25 ? 'text-xl' : 'text-2xl'}`}
                                    style={{ textWrap: 'balance' }}
                                >
                                    {selectedMember.name}
                                </h2>

                                {/* Datas Vitais */}
                                <div className="mt-2 flex items-center gap-3 text-sm font-medium text-rosa-cha/90">
                                    {selectedMember.birth_date && (
                                        <span className="flex items-center gap-1">
                                            ⭐ {formatDate(selectedMember.birth_date)}
                                        </span>
                                    )}
                                    {selectedMember.is_deceased && selectedMember.death_date && (
                                        <>
                                            <span className="opacity-50">|</span>
                                            <span className="flex items-center gap-1">
                                                ✝️ {formatDate(selectedMember.death_date)}
                                            </span>
                                        </>
                                    )}
                                </div>

                                {(selectedMember.role === 'patriarca' || selectedMember.role === 'matriarca') && (
                                    <span className="mt-3 inline-block text-[10px] uppercase tracking-widest bg-gold/90 px-3 py-1 rounded-full text-white font-bold shadow-sm backdrop-blur-sm">
                                        {selectedMember.role === 'patriarca' ? 'Patriarca' : 'Matriarca'}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="p-6">
                            {selectedMember.description ? (
                                <div className="mb-6 bg-stone-50 p-4 rounded-xl border border-stone-100">
                                    <p className="text-gray-600 leading-relaxed text-sm font-light italic">
                                        "{selectedMember.description}"
                                    </p>
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm mb-6 text-center italic">Sem biografia disponível.</p>
                            )}

                            {/* Social Links */}
                            <div className="flex justify-center gap-4 pt-2 border-t border-gray-100">
                                {selectedMember.social_links?.instagram && (
                                    <a
                                        href={selectedMember.social_links.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-pink-50 text-pink-600 rounded-full hover:scale-110 transition-transform hover:bg-pink-100"
                                        title="Instagram"
                                    >
                                        <Instagram size={20} />
                                    </a>
                                )}
                                {selectedMember.social_links?.facebook && (
                                    <a
                                        href={selectedMember.social_links.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-blue-50 text-blue-600 rounded-full hover:scale-110 transition-transform hover:bg-blue-100"
                                        title="Facebook"
                                    >
                                        <Facebook size={20} />
                                    </a>
                                )}
                                {selectedMember.social_links?.whatsapp && (
                                    <a
                                        href={`https://wa.me/${selectedMember.social_links.whatsapp.replace(/\D/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-green-50 text-green-600 rounded-full hover:scale-110 transition-transform hover:bg-green-100"
                                        title="WhatsApp"
                                    >
                                        <Phone size={20} />
                                    </a>
                                )}
                                {(!selectedMember.social_links?.instagram && !selectedMember.social_links?.facebook && !selectedMember.social_links?.whatsapp) && (
                                    <span className="text-xs text-gray-300">Sem redes sociais cadastradas</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
