export interface Convidado {
    id: string;  // UUID do Supabase
    created_at: string;
    nome_completo: string;
    idade: number | null;
    vai_comparecer: boolean;
    qtd_acompanhantes: number;
    nomes_acompanhantes: string | null;
    mensagem_justificativa: string | null;
}

export interface FamilyMember {
    id: string;
    parent_id: string | null;
    name: string;
    photo_url: string | null;
    description: string | null;
    social_links: {
        instagram?: string;
        whatsapp?: string;
        facebook?: string;
    };
    birth_date: string | null;
    death_date: string | null;
    is_deceased: boolean;
    role: 'patriarca' | 'matriarca' | 'descendente';
    // Deprecated but keeping for migration safety if needed, though instruction said remove. 
    // I will remove it from the required types for new logic.
    // birth_order: number; - Removed as per instruction
    created_at?: string;
}

export type ConvidadoInsert = Omit<Convidado, 'id' | 'created_at'>;
