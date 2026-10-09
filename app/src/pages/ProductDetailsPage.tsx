import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // To get the product ID from the URL
import { Button, Typography, TextField } from "@mui/material";
import api from "../api";
import defaultProductImage from "../images/dummy.jpeg";

// Define the type for Product
interface Product {
  _id: string;
  name: string;
  brand: string;
  price: number;
  description: string;
  nutritionDetails: string;
  image?: string;
}

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();  // Get the product ID from the URL
  const [product, setProduct] = useState<Product | null>(null);  // Store the fetched product details
  const [quantity, setQuantity] = useState<number>(1);  // Store the quantity of the product

  // Fetch the product details when the component mounts
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get<Product>(`/foodProduct/${id}`);
        setProduct(response.data);  // Store the product details
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();  // Call fetchProduct when the component mounts
  }, [id]);  // Rerun the effect when the product ID changes

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    console.log("Product added to cart:", { product, quantity });
  };

  return (
    <div className="product-details-page">
      <main>
        {product ? (
          <div className="product-details-grid">
            {/* Product Image */}
            <div className="product-image">
              <img
                src={product.image || defaultProductImage}
                alt={product.name}
                className="product-image"
              />
            </div>

            {/* Product Info */}
            <div className="product-info">
              <Typography variant="h5" className="product-name">
                {product.name}
              </Typography>
              <Typography variant="subtitle1" className="product-brand">
                Brand: {product.brand}
              </Typography>
              <Typography variant="body1" className="product-description">
                {product.description}
              </Typography>
              <Typography variant="body2" className="product-nutrition">
                Nutrition Details: {product.nutritionDetails}
              </Typography>

              {/* Quantity and Add to Cart */}
              <div className="product-actions">
                <Button variant="outlined" onClick={decrementQuantity}>-</Button>
                <TextField value={quantity} inputProps={{ readOnly: true }} />
                <Button variant="outlined" onClick={incrementQuantity}>+</Button>
                <Button variant="contained" onClick={handleAddToCart}>
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Typography>Loading product details...</Typography>
        )}
      </main>
    </div>
  );
};

export default ProductDetailsPage;
