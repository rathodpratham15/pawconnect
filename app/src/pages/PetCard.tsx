type Pet = {
    _id: string;
    name: string;
    type: string;
    breed: string;
    age: number;
    imageUrl?: string; // Optional
};

type PetCardProps = {
    pet: Pet;
    onAdopt: (pet: Pet) => void;
};

const PetCard: React.FC<PetCardProps> = ({ pet, onAdopt }) => {
    return (
        <div className="pet-card">
            <img src={pet.imageUrl || "/default-image.jpg"} alt={pet.name} className="pet-image" />
            <div className="pet-info">
                <h2 className="pet-name">{pet.name}</h2>
                <p className="pet-details">
                    Type: {pet.type}
                    <br />
                    Breed: {pet.breed}
                    <br />
                    Age: {pet.age} years
                </p>
                <button onClick={() => onAdopt(pet)} className="adopt-button">
                    Adopt
                </button>
            </div>
        </div>
    );
};

export default PetCard;
