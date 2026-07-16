export interface Level {
    id: number;
    level_number: number;
    title: string;
    type: 'sound' | 'word' | 'sentence' | 'write';
    description: string;
    scene_image: string;
    is_active: boolean;
}

export interface InventoryItem {
    id: number;
    level_id: number;
    name: string;
    image_file: string | null;
    audio_file: string | null;
    klank: string;
    position_x: number;
    position_y: number;
    width: number;
    height: number;
}

export interface LevelDetail {
    level: Level;
    assignments: any[];
    items: InventoryItem[];
}

