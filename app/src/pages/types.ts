export interface Pet {
    _id: string;
    type: string;
    breed: string;
    age: number;
    size: string;
    disabilityStatus: boolean;
    healthConcerns: string[];
    shelterLocation: string;
}

export interface Fundraiser {
    id: string;
    title: string;
    description: string;
    targetAmount: number;
    currentAmount: number;
    imageUrl: string;
    createdAt: Date;
    createdBy: string;
    category: 'medical' | 'shelter' | 'food' | 'supplies';
    status: 'active' | 'completed' | 'suspended';
}

// export interface Donation {
//     id: string;
//     fundraiserId: string;
//     amount: number;
//     donorName: string;
//     donorEmail: string;
//     message?: string;
//     createdAt: Date;
//     type: 'money' | 'food' | 'supplies';
//     anonymous: boolean;
// }

export interface CreateFundraiserFormData {
    title: string;
    description: string;
    targetAmount: number;
    category: Fundraiser['category'];
    imageUrl: string;
}
