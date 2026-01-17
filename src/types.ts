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

export type ConvidadoInsert = Omit<Convidado, 'id' | 'created_at'>;
