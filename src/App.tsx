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

const termOptions = [
  { value: 1, label: '1 Month' },
  { value: 12, label: '12 Months (1 Year)' },
  { value: 24, label: '24 Months (2 Years)' },
  { value: 36, label: '36 Months (3 Years)' }
];

const App: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);
  const [units, setUnits] = useState<number>(0);
  const [quota, setQuota] = useState<number>(0);
  const [termLength, setTermLength] = useState<number>(12); // Default to annual
  const [attainment, setAttainment] = useState<{
    monthly: number;
    annual: number;
    totalRevenue: number;
    annualRevenue: number;
    cascadeRevenue: number;
    codeiumCoreRevenue: number;
  } | null>(null);

  const calculateAttainment = () => {
    if (quota === 0) return;

    const monthlyRevenue = units * selectedProduct.listPrice;
    const annualizedRevenue = (monthlyRevenue * 12);
    const termRevenue = monthlyRevenue * termLength;
    
    // Calculate monthly and annual attainment
    const monthlyAttainment = (monthlyRevenue / (quota / 12)) * 100;
    const annualAttainment = (annualizedRevenue / quota) * 100;

    setAttainment({
      monthly: monthlyAttainment,
      annual: annualAttainment,
      totalRevenue: termRevenue,
      annualRevenue: annualizedRevenue,
      cascadeRevenue: units * selectedProduct.cascadePrice * termLength,
      codeiumCoreRevenue: units * selectedProduct.codeiumCorePrice * termLength
    });
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
                {product.name} (${product.listPrice}/month)
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
          Term Length:
          <select
            value={termLength}
            onChange={(e) => setTermLength(Number(e.target.value))}
          >
            {termOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="input-group">
        <label>
          Annual Quota ($):
          <input
            type="number"
            min="0"
            value={quota}
            onChange={(e) => setQuota(Number(e.target.value))}
          />
        </label>
      </div>

      <button onClick={calculateAttainment}>Calculate Attainment</button>

      {attainment && (
        <div className="result">
          <h2>Quota Attainment</h2>
          <div className="details">
            <div className="attainment-metrics">
              <div className="metric">
                <h3>Monthly</h3>
                <p>{attainment.monthly.toFixed(1)}%</p>
              </div>
              <div className="metric">
                <h3>Annual</h3>
                <p>{attainment.annual.toFixed(1)}%</p>
              </div>
            </div>
            
            <div className="revenue-details">
              <h3>Revenue Breakdown ({termLength} months)</h3>
              <p>Monthly Revenue: ${(attainment.totalRevenue / termLength).toFixed(2)}</p>
              <p>Term Total Revenue: ${attainment.totalRevenue.toFixed(2)}</p>
              <p>Annualized Revenue: ${attainment.annualRevenue.toFixed(2)}</p>
              <p>Term Cascade Revenue: ${attainment.cascadeRevenue.toFixed(2)}</p>
              <p>Term Codeium Core Revenue: ${attainment.codeiumCoreRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
