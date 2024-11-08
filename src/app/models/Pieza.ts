export interface TotalPieza {
    materialId: string; // Corresponds to Schema.Types.ObjectId in Mongoose
    stockMaterial: number;
}

// Interface for the main Pieza structure
export interface Pieza {
    _id: string; // Corresponds to Schema.Types.ObjectId in Mongoose
    name: string;
    totalPieza: TotalPieza[];
    createdAt?: Date; // Corresponds to the timestamps option in Mongoose
    updatedAt?: Date; // Corresponds to the timestamps option in Mongoose
}