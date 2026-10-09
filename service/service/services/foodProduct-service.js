import { query } from "../db.js";
import { definedOnly, isUuid, optionalString, requiredNumber, requiredString } from "../validation.js";

const mapFoodProduct = (row) =>
    row && {
        _id: row.id,
        name: row.name,
        brand: row.brand,
        price: row.price,
        description: row.description ?? undefined,
        nutritionDetails: row.nutrition_details,
        sold: row.sold,
        image: row.image ?? undefined,
    };

export const save = async (newFoodProduct) => {
    const product = definedOnly({
        name: requiredString(newFoodProduct, "name"),
        brand: requiredString(newFoodProduct, "brand"),
        price: requiredNumber(newFoodProduct, "price", { min: 0 }),
        description: optionalString(newFoodProduct, "description"),
        nutrition_details: requiredString(newFoodProduct, "nutritionDetails"),
        sold: requiredNumber(newFoodProduct, "sold", { partial: true, min: 0 }),
        image: optionalString(newFoodProduct, "image"),
    });
    const columns = Object.keys(product);
    const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ");
    const { rows } = await query(
        `INSERT INTO food_products (${columns.join(", ")}) VALUES (${placeholders}) RETURNING *`,
        columns.map((column) => product[column])
    );
    return mapFoodProduct(rows[0]);
};

// Get all food products
export const getAllFoodProducts = async () => {
    const { rows } = await query("SELECT * FROM food_products ORDER BY name");
    return rows.map(mapFoodProduct);
};

// Get a food product by its ID from the database
export const getFoodProductById = async (foodProductId) => {
    if (!isUuid(foodProductId)) return null;
    const { rows } = await query("SELECT * FROM food_products WHERE id = $1", [foodProductId]);
    return mapFoodProduct(rows[0]) ?? null;
};
