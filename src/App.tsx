import React, { useState } from 'react';

interface Product {
  name: string;
  listPrice: number;
  cascadePrice: number;
  codeiumCorePrice: number;
}

const products: Product[] = [
  {
    name: 'Cloud Flow Entry',
    listPrice: 73.00,
    cascadePrice: 44.00,
    codeiumCorePrice: 29.00
  },
  {
    name: 'Cloud Flow Standard',
    listPrice: 128.00,
    cascadePrice: 99.00,
    codeiumCorePrice: 29.00
  },
  {
    name: 'Hybrid Flow Entry',
    listPrice: 83.00,
    cascadePrice: 44.00,
    codeiumCorePrice: 39.00
  },
  {
    name: 'Hybrid Flow Standard',
    listPrice: 138.00,
    cascadePrice: 99.00,
    codeiumCorePrice: 39.00
  }
];

const App: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);
  const [units, setUnits] = useState<number>(0);
  const [quota, setQuota] = useState<number>(0);
  const [attainment, setAttainment] = useState<number>(0);

  const calculateAttainment = () => {
    if (quota === 0) return;
    const revenue = units * selectedProduct.listPrice;
    const calculatedAttainment = (revenue / quota) * 100;
    setAttainment(calculatedAttainment);
  };

  return (
    <div className="container">
      <h1>Quota Attainment Calculator</h1>
      
      <div className="input-group">
        <label>
          Product:
          <select 
            value={selectedProduct.name}
            onChange={(e) => {
              const product = products.find(p => p.name === e.target.value);
              if (product) setSelectedProduct(product);
            }}
          >
            {products.map(product => (
              <option key={product.name} value={product.name}>
                {product.name} (${product.listPrice})
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="input-group">
        <label>
          Number of Units:
          <input
            type="number"
            min="0"
            value={units}
            onChange={(e) => setUnits(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="input-group">
        <label>
          Quota ($):
          <input
            type="number"
            min="0"
            value={quota}
            onChange={(e) => setQuota(Number(e.target.value))}
          />
        </label>
      </div>

      <button onClick={calculateAttainment}>Calculate Attainment</button>

      {attainment > 0 && (
        <div className="result">
          <h2>Quota Attainment: {attainment.toFixed(1)}%</h2>
          <div className="details">
            <p>Total Revenue: ${(units * selectedProduct.listPrice).toFixed(2)}</p>
            <p>Cascade Revenue: ${(units * selectedProduct.cascadePrice).toFixed(2)}</p>
            <p>Codeium Core Revenue: ${(units * selectedProduct.codeiumCorePrice).toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
