import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import api from "../api";
import PetCard from "./PetCard";
import Header from "../components/Header"; // Import the Header component
import "../styles/Adopt.css";

type Pet = {
    _id: string;
    name: string;
    type: string;
    breed: string;
    age: number;
    size: string;
    disabilityStatus: boolean;
    healthConcerns: string[];
    shelterLocation: string;
};

type Filters = {
    type: string;
    breed: string;
    size: string;
    maxAge: number;
};

type NewPet = {
    type: string;
    breed: string;
    age: number | "";
    size: string;
    disabilityStatus: boolean;
    healthConcerns: string[];
    shelterLocation: string;
};

const PetAdoptionApp: React.FC = () => {
    // State types
    const [pets, setPets] = useState<Pet[]>([]);
    const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
    const [filters, setFilters] = useState<Filters>({
        type: "all",
        breed: "all",
        size: "all",
        maxAge: 10,
    });

    const [newPet, setNewPet] = useState<NewPet>({
        type: "",
        breed: "",
        age: "",
        size: "",
        disabilityStatus: false,
        healthConcerns: [],
        shelterLocation: "",
    });

    const [showForm, setShowForm] = useState<boolean>(false);

    // Fetch pets from the backend
    useEffect(() => {
        const fetchPets = async () => {
            try {
                const response = await api.get<Pet[]>("/pets");
                setPets(response.data);
                setFilteredPets(response.data);
            } catch (error) {
                console.error("Error fetching pets:", (error as Error).message);
            }
        };

        fetchPets();
    }, []);

    // Add new pet
    const handleAddPet = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post<Pet>("/pets", newPet);
            setPets([...pets, response.data]);
            setFilteredPets([...filteredPets, response.data]);
            setShowForm(false);
        } catch (error) {
            console.error("Error adding pet:", (error as Error).message);
        }
    };

    // Filter pets whenever filters change
    useEffect(() => {
        let result = pets;

        if (filters.type !== "all") {
            result = result.filter((pet) => pet.type.toLowerCase() === filters.type.toLowerCase());
        }

        if (filters.breed !== "all") {
            result = result.filter((pet) => pet.breed.toLowerCase() === filters.breed.toLowerCase());
        }

        if (filters.size !== "all") {
            result = result.filter((pet) => pet.size.toLowerCase() === filters.size.toLowerCase());
        }

        result = result.filter((pet) => pet.age <= filters.maxAge);

        setFilteredPets(result);
    }, [filters, pets]);

    return (
        <div className="pet-adoption-container">
            {/* Integrate the Header component */}
            <Header showHamburger={true} showCart={true} />

            <div className="content-container">

                {/* Sidebar */}
                <div className="filter-sidebar">
                    <h2 className="sidebar-title">Filters</h2>
                    {/* Type Filter */}
                    <div className="filter-group">
                        <label className="filter-label">
                            Pet Type
                            <select
                                value={filters.type}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                    setFilters((prev) => ({ ...prev, type: e.target.value }))
                                }
                                className="filter-select"
                            >
                                <option value="all">All Types</option>
                                {Array.from(new Set(pets.map((pet) => pet.type))).map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    {/* Breed Filter */}
                    <div className="filter-group">
                        <label className="filter-label">
                            Breed
                            <select
                                value={filters.breed}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                    setFilters((prev) => ({ ...prev, breed: e.target.value }))
                                }
                                className="filter-select"
                            >
                                <option value="all">All Breeds</option>
                                {Array.from(new Set(pets.map((pet) => pet.breed))).map((breed) => (
                                    <option key={breed} value={breed}>
                                        {breed}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    {/* Size Filter */}
                    <div className="filter-group">
                        <label className="filter-label">
                            Size
                            <select
                                value={filters.size}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                    setFilters((prev) => ({ ...prev, size: e.target.value }))
                                }
                                className="filter-select"
                            >
                                <option value="all">All Sizes</option>
                                {Array.from(new Set(pets.map((pet) => pet.size))).map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    {/* Age Filter */}
                    <div className="filter-group">
                        <label className="filter-label">
                            Max Age
                            <input
                                type="range"
                                min="1"
                                max="20"
                                value={filters.maxAge}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setFilters((prev) => ({ ...prev, maxAge: Number(e.target.value) }))
                                }
                                className="filter-range"
                            />
                            <span className="age-display">{filters.maxAge} years</span>
                        </label>
                    </div>
                </div>

                {/* Main Content */}
                <div className="main-content">
                    <h1 className="page-title">Pet Adoption Center</h1>
                    <button className="add-pet-button" onClick={() => setShowForm(true)}>
                        Add Pet
                    </button>

                    {showForm && (
                        <div className="add-pet-form">
                            <h2 className="form-title">Add New Pet</h2>
                            <form onSubmit={handleAddPet} className="pet-form">
                                <div className="form-group">
                                    <label>Type:</label>
                                    <input
                                        type="text"
                                        value={newPet.type}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            setNewPet({ ...newPet, type: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Breed:</label>
                                    <input
                                        type="text"
                                        value={newPet.breed}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            setNewPet({ ...newPet, breed: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Age:</label>
                                    <input
                                        type="number"
                                        value={newPet.age}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            setNewPet({ ...newPet, age: Number(e.target.value) })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Size:</label>
                                    <input
                                        type="text"
                                        value={newPet.size}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            setNewPet({ ...newPet, size: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Disability Status:</label>
                                    <input
                                        type="checkbox"
                                        checked={newPet.disabilityStatus}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            setNewPet({ ...newPet, disabilityStatus: e.target.checked })
                                        }
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Health Concerns:</label>
                                    <input
                                        type="text"
                                        value={newPet.healthConcerns.join(", ")}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            setNewPet({ ...newPet, healthConcerns: e.target.value.split(",") })
                                        }
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Shelter Location:</label>
                                    <input
                                        type="text"
                                        value={newPet.shelterLocation}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            setNewPet({ ...newPet, shelterLocation: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-buttons">
                                    <button type="submit" className="submit-button2">
                                        Add Pet
                                    </button>
                                    <button
                                        type="button"
                                        className="cancel-button"
                                        onClick={() => setShowForm(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Pets Grid */}
                    <div className="pets-grid">
                        {filteredPets.map((pet) => (
                            <PetCard
                                key={pet._id}
                                pet={pet}
                                onAdopt={(p) => alert(`Thanks for your interest in adopting this ${p.type}! The shelter will be notified.`)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetAdoptionApp;