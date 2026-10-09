import React, { useState, useEffect } from "react";
import "../styles/FoodProducts.css";
import rawblendsDogFood from "../images/rawblendsDogFood.jpeg";
import dParrotFood from "../images/3dParrotFood.jpeg";
import hillsCatFood from "../images/hillsCatFood.jpeg";
import maximeDogFood from "../images/maximeDogFood.jpeg";
import noissueDogTreats from "../images/noissueDogTreats.jpeg";
import parakreetDogFood from "../images/parakreetDogFood.webp";
import shebaCatFood from "../images/shebaCatFood.jpeg";
import yumyumDogFood from "../images/yumyumDogFood.jpeg";
import Header from "../components/Header";
import { Typography, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import Grid from '@mui/material/Grid'; // Ensure correct path
import { useNavigate } from "react-router-dom";
import api from "../api";
import defaultProductImage from "../images/dummy.jpeg";
// import AddFoodProduct from "../pages/AddFoodProduct";


// Define types for Product and Props
interface Product {
  _id: string;
  name: string;
  price: number;
  sold?: number;
  image?: string;
}

const FoodProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]); // Stores products fetched from the API
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // Stores filtered product list
  const [filter, setFilter] = useState<string>("Product Name"); // Tracks the selected filter
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get<Product[]>("/foodProduct");
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    const selectedFilter = event.target.value;
    setFilter(selectedFilter);

    let sortedProducts: Product[];
    switch (selectedFilter) {
      case "Price: Low to High":
        sortedProducts = [...products].sort((a, b) => a.price - b.price);
        break;
      case "Price: High to Low":
        sortedProducts = [...products].sort((a, b) => b.price - a.price);
        break;
      case "Best Sellers":
        sortedProducts = [...products].sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0));
        break;
      default:
        sortedProducts = [...products];
    }

    setFilteredProducts(sortedProducts);
  };

  return (
    <>
      <div className="food-products-page">
        <Header showCart showHamburger />
        <main>
          <section className="product-header">
            <Typography variant="h4">Food Products</Typography>
            <Select
              value={filter}
              onChange={handleFilterChange}
              className="product-filter"
              displayEmpty
            >
              <MenuItem value="Product Name">Product Name</MenuItem>
              <MenuItem value="Price: Low to High">Price: Low to High</MenuItem>
              <MenuItem value="Price: High to Low">Price: High to Low</MenuItem>
              <MenuItem value="Best Sellers">Best Sellers</MenuItem>
            </Select>
          </section>

          <section className="product-grid">
            <div className="product-card">
              <img
                src={rawblendsDogFood}
                alt="RawBlends Dog Food"
                className="product-image"
              />
              <div className="product-info">
                <Typography variant="h6" className="product-name">
                  RawBlends Dog Food
                </Typography>
              
              </div>
            </div>

            <div className="product-card">
              <img
                src={hillsCatFood}
                alt="Hills Cat Food"
                className="product-image"
              />
              <div className="product-info">
                <Typography variant="h6" className="product-name">
                  Hills Cat Food
                </Typography>
                <div className="amount"></div>
              </div>
            </div>

            <div className="product-card">
              <img
                src={dParrotFood}
                alt="3D Parrot Food"
                className="product-image"
              />
              <div className="product-info">
                <Typography variant="h6" className="product-name">
                  3D Parrot Food
                </Typography>
              </div>
            </div>

            <div className="product-card">
              <img
                src={maximeDogFood}
                alt="Maxime Dog Food"
                className="product-image"
              />
              <div className="product-info">
                <Typography variant="h6" className="product-name">
                  Maxime Dog Food
                </Typography>
              </div>
            </div>

            <div className="product-card">
              <img
                src={noissueDogTreats}
                alt="NoIssue Pet Food"
                className="product-image"
              />
              <div className="product-info">
                <Typography variant="h6" className="product-name">
                  NoIssue Pet Food
                </Typography>
              </div>
            </div>

            <div className="product-card">
              <img
                src={parakreetDogFood}
                alt="Parakreet Dog Food"
                className="product-image"
              />
              <div className="product-info">
                <Typography variant="h6" className="product-name">
                Parakreet Dog Food
                </Typography>
              </div>
            </div>

            <div className="product-card">
              <img
                src={shebaCatFood}
                alt="Sheba Cat Food"
                className="product-image"
              />
              <div className="product-info">
                <Typography variant="h6" className="product-name">
                Sheba Cat Food
                </Typography>
              </div>
            </div>

            <div className="product-card">
              <img
                src={yumyumDogFood}
                alt="Yum Yum Dog Food"
                className="product-image"
              />
              <div className="product-info">
                <Typography variant="h6" className="product-name">
                Yum Yum Dog Food
                </Typography>
              </div>
            </div>
          </section>

          <Grid container spacing={3} className="product-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product._id}>
                  <div className="product-card" onClick={() => navigate(`/productdetails/${product._id}`)}>
                    <img
                      src={product.image || defaultProductImage}
                      alt={product.name}
                      className="product-image"
                    />
                    <div className="product-info">
                      <Typography variant="h6" className="product-name">
                        {product.name}
                      </Typography>
                    </div>
                  </div>
                </Grid>
              ))
            ) : (
              <Typography variant="body1"></Typography>
            )}
          </Grid>
        </main>

        <footer className="footer">
          <Typography variant="body2" align="center">
            &copy; 2024 Pet Food Store
          </Typography>
        </footer>
      </div>
    </>
  );
};

export default FoodProducts;
