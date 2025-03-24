import React, { useState } from "react";
import Header from "../layouts/Header.jsx";
import '../styles/pages/ExchangeMarket.css'
import Search_bar from '../components/ui/SearchBar.jsx'
import images from "../components/features/exchangemarket/Photo.jsx";
import {Product} from "../components/features/exchangemarket/Product.jsx";

function Market() {
    const [product_items, setProduct_item] = useState ([
        { id: 1, name: 'Sản phẩm 1', price: '100,000₫', ImgScr: images.seedling_solid },
        { id: 2, name: 'Sản phẩm 2', price: '200,000₫', ImgScr: images.seedling_solid },
        { id: 3, name: 'Sản phẩm 3', price: '300,000₫', ImgScr: images.seedling_solid },
        { id: 4, name: 'Sản phẩm 4', price: '400,000₫', ImgScr: images.seedling_solid },
        { id: 5, name: 'Sản phẩm 5', price: '500,000₫', ImgScr: images.seedling_solid },
        { id: 6, name: 'Sản phẩm 6', price: '460,000₫', ImgScr: images.seedling_solid },
        { id: 7, name: 'Sản phẩm 7', price: '700,000₫', ImgScr: images.seedling_solid },
        { id: 8, name: 'Sản phẩm 8', price: '800,000₫', ImgScr: images.seedling_solid },
        { id: 9, name: 'Sản phẩm 9', price: '400,000₫', ImgScr: images.seedling_solid },
    ]);

    const addProduct_item = ({ name, price, ImgScr}) => {
        const newProduct_item = {
            id: product_items.length + 1,
            name: name,
            price: price, 
            ImgScr: ImgScr,
        }
        setProduct_item([...product_items, newProduct_item]);
    };

    return (
        <div className="container-main-market">
            <div className="header">
                <Header/>
            </div>
            <div className="section-search">
                <div className="container-search_bar">
                    <Search_bar/>
                </div>
                <div className="button-shopping-cart">
                  <button >
                    <img src={images.shopping_cart} className="img-cart"></img>
                  </button>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 p-4">
                {product_items.map((product) => (
                    <div key={product.id} className="p-4 border rounded-lg shadow-lg hover:shadow-lg transition bg-gray-200">
                        <Product  
                            name = {product.name}
                            price = {product.price}
                            ImgScr = {product.ImgScr} 
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Market;