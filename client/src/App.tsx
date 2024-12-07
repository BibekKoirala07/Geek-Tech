import { useState } from "react";
import "./App.css";

interface Package {
  items: string[];
  totalWeight: number;
  totalPrice: number;
  courierPrice: number;
}

interface OrderResponse {
  packages: Package[] | [];
}

function App() {
  const [result, setResult] = useState<OrderResponse>({ packages: [] });

  const [products, setProducts] = useState([
    { name: "Item 1", price: 10, weight: 200, selected: false },
    { name: "Item 2", price: 100, weight: 20, selected: false },
    { name: "Item 3", price: 30, weight: 300, selected: false },
    { name: "Item 4", price: 20, weight: 500, selected: false },
    { name: "Item 5", price: 30, weight: 250, selected: false },
    { name: "Item 6", price: 40, weight: 10, selected: false },
    { name: "Item 7", price: 200, weight: 10, selected: false },
    { name: "Item 8", price: 120, weight: 500, selected: false },
    { name: "Item 9", price: 130, weight: 790, selected: false },
    { name: "Item 10", price: 20, weight: 100, selected: false },
    { name: "Item 11", price: 10, weight: 340, selected: false },
    { name: "Item 12", price: 5, weight: 200, selected: false },
    { name: "Item 13", price: 5, weight: 200, selected: false },
    { name: "Item 14", price: 240, weight: 200, selected: false },
    { name: "Item 15", price: 123, weight: 700, selected: false },
    { name: "Item 16", price: 245, weight: 20, selected: false },
    { name: "Item 17", price: 230, weight: 10, selected: false },
    { name: "Item 18", price: 110, weight: 200, selected: false },
    { name: "Item 19", price: 45, weight: 200, selected: false },
    { name: "Item 20", price: 67, weight: 500, selected: false },
    { name: "Item 21", price: 88, weight: 300, selected: false },
    { name: "Item 22", price: 10, weight: 500, selected: false },
    { name: "Item 23", price: 17, weight: 250, selected: false },
    { name: "Item 24", price: 19, weight: 10, selected: false },
    { name: "Item 25", price: 89, weight: 500, selected: false },
    { name: "Item 26", price: 45, weight: 500, selected: false },
    { name: "Item 27", price: 99, weight: 790, selected: false },
    { name: "Item 28", price: 125, weight: 10, selected: false },
    { name: "Item 29", price: 198, weight: 340, selected: false },
    { name: "Item 30", price: 220, weight: 800, selected: false },
    { name: "Item 31", price: 249, weight: 200, selected: false },
    { name: "Item 32", price: 230, weight: 200, selected: false },
    { name: "Item 33", price: 19, weight: 200, selected: false },
    { name: "Item 34", price: 45, weight: 10, selected: false },
    { name: "Item 35", price: 12, weight: 200, selected: false },
    { name: "Item 36", price: 5, weight: 200, selected: false },
    { name: "Item 37", price: 2, weight: 200, selected: false },
    { name: "Item 38", price: 90, weight: 200, selected: false },
    { name: "Item 39", price: 12, weight: 500, selected: false },
    { name: "Item 40", price: 167, weight: 500, selected: false },
    { name: "Item 41", price: 8, weight: 10, selected: false },
    { name: "Item 42", price: 12, weight: 250, selected: false },
    { name: "Item 43", price: 2, weight: 10, selected: false },
    { name: "Item 44", price: 210, weight: 790, selected: false },
    { name: "Item 45", price: 167, weight: 100, selected: false },
    { name: "Item 46", price: 23, weight: 340, selected: false },
    { name: "Item 47", price: 189, weight: 800, selected: false },
    { name: "Item 48", price: 199, weight: 200, selected: false },
  ]);

  const toggleSelection = (index: any) => {
    console.log("index:", index);
    setProducts((prevProducts) =>
      prevProducts.map((product, i) =>
        i === index ? { ...product, selected: !product.selected } : product
      )
    );
  };

  const handleSubmit = async () => {
    console.log("handleSubmit");
    const response = await fetch("http://localhost:3000/place-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        products: products.filter((each) => each.selected),
      }),
    });
    const data = await response.json();
    if (data.success) {
      setResult({ packages: data.data });
    }
    console.log("Order placed successfully:", data);
  };

  const handleResetSelection = () => {
    setProducts((prevProducts) =>
      prevProducts.map((product) => ({ ...product, selected: false }))
    );
    setResult({ packages: [] });
  };

  return (
    <div className="main">
      <div className="product-list">
        <div className="total-product">
          {products.map((each, index) => {
            return (
              <div className="each-product" key={index}>
                <input
                  type="checkbox"
                  checked={each.selected}
                  onChange={() => toggleSelection(index)}
                />
                <span>Name: {each.name}</span>
                <span>Price: ${each.price}</span>
                <span>Weigth: {each.weight} grams</span>
              </div>
            );
          })}
        </div>
        <div className="place-orders">
          <button onClick={handleResetSelection}>Reset</button>
          <button onClick={handleSubmit}>Place Order</button>
        </div>
      </div>
      <div className="display-result">
        {result.packages.length > 0 ? (
          result.packages.map((pkg, index) => (
            <div key={index}>
              <h3>Package {index + 1}</h3>
              <p>Items: {pkg.items.join(", ")}</p>
              <p>Total Weight: {pkg.totalWeight} grams</p>
              <p>Total Price: ${pkg.totalPrice}</p>
              <p>Courier Price: ${pkg.courierPrice}</p>
            </div>
          ))
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <h1>Place your Order</h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
