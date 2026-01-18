import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { User } from 'lucide-react';

interface FamilyNodeProps {
    data: {
        label: string;
        photo_url?: string;
        birth_order?: number;
        is_deceased?: boolean;
    };
    isConnectable: boolean;
}

export const FamilyNode = memo(({ data, isConnectable }: FamilyNodeProps) => {
    return (
        <div className="flex flex-col items-center">
            {/* Input Handle (Top) */}
            <Handle
                type="target"
                position={Position.Top}
                isConnectable={isConnectable}
                className="!bg-rosa-forte"
            />

            {/* Node Content */}
            <div className="relative group transition-transform hover:scale-105 duration-300">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-rosa-cha bg-white overflow-hidden shadow-lg flex items-center justify-center">
                    {data.photo_url ? (
                        <img
                            src={data.photo_url}
                            alt={data.label}
                            className={`w-full h-full object-cover ${data.is_deceased ? 'grayscale' : ''}`}
                            draggable={false}
                        />
                    ) : (
                        <div className="text-rosa-cha">
                            <User size={32} />
                        </div>
                    )}
                </div>
                {/* Badge de Ordem (Opcional) */}
                {/* {data.birth_order !== undefined && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gold text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm">
                        {data.birth_order + 1}
                    </div>
                )} */}
            </div>

            <div className="mt-3 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm border border-rosa-cha/30 group-hover:border-rosa-forte transition-colors">
                <p className="text-sm font-serif font-bold text-gray-800 whitespace-nowrap">
                    {data.label}
                </p>
            </div>

            {/* Output Handle (Bottom) */}
            <Handle
                type="source"
                position={Position.Bottom}
                isConnectable={isConnectable}
                className="!bg-rosa-forte"
            />
        </div>
    );
});
