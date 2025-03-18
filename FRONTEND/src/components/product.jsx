import React from "react";
import '../styles/components/product.scss'

export function Product ({name, price, ImgScr}) {
    return (
        <div className="conainer-product">
            <div className="container-product-img">
                <img src={ImgScr} />
            </div>
            <h3>{name}</h3>
            <h6>{price}</h6>
        </div>
    )
}