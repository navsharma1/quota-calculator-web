import React, { useState } from 'react';

interface Product {
  name: string;
  cascadeListPrice: number;
  codeiumCoreListPrice: number;
}

const products: Product[] = [
  {
    name: 'Cloud Flow Entry',
    cascadeListPrice: 44.00,
    codeiumCoreListPrice: 29.00
  },
  {
    name: 'Cloud Flow Standard',
    cascadeListPrice: 99.00,
    codeiumCoreListPrice: 29.00
  },
  {
    name: 'Hybrid Flow Entry',
    cascadeListPrice: 44.00,
    codeiumCoreListPrice: 39.00
  },
  {
    name: 'Hybrid Flow Standard',
    cascadeListPrice: 99.00,
    codeiumCoreListPrice: 39.00
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
    cascadeRevenue: {
      monthly: number;
      term: number;
      annual: number;
    };
    codeiumCoreRevenue: {
      monthly: number;
      term: number;
      annual: number;
    };
  } | null>(null);

  const calculateAttainment = () => {
    if (quota === 0) return;

    const monthlyCascadeRevenue = units * selectedProduct.cascadeListPrice;
    const monthlyCodeiumCoreRevenue = units * selectedProduct.codeiumCoreListPrice;
    const monthlyTotalRevenue = monthlyCascadeRevenue + monthlyCodeiumCoreRevenue;

    const annualizedRevenue = monthlyTotalRevenue * 12;
    const termRevenue = monthlyTotalRevenue * termLength;
    
    // Calculate monthly and annual attainment
    const monthlyAttainment = (monthlyTotalRevenue / (quota / 12)) * 100;
    const annualAttainment = (annualizedRevenue / quota) * 100;

    setAttainment({
      monthly: monthlyAttainment,
      annual: annualAttainment,
      totalRevenue: termRevenue,
      annualRevenue: annualizedRevenue,
      cascadeRevenue: {
        monthly: monthlyCascadeRevenue,
        term: monthlyCascadeRevenue * termLength,
        annual: monthlyCascadeRevenue * 12
      },
      codeiumCoreRevenue: {
        monthly: monthlyCodeiumCoreRevenue,
        term: monthlyCodeiumCoreRevenue * termLength,
        annual: monthlyCodeiumCoreRevenue * 12
      }
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
                {product.name} (Cascade: ${product.cascadeListPrice}/mo, Codeium Core: ${product.codeiumCoreListPrice}/mo)
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
              
              <div className="product-revenue">
                <h4>Cascade Revenue</h4>
                <p>Monthly: ${attainment.cascadeRevenue.monthly.toFixed(2)}</p>
                <p>Term Total: ${attainment.cascadeRevenue.term.toFixed(2)}</p>
                <p>Annualized: ${attainment.cascadeRevenue.annual.toFixed(2)}</p>
              </div>

              <div className="product-revenue">
                <h4>Codeium Core Revenue</h4>
                <p>Monthly: ${attainment.codeiumCoreRevenue.monthly.toFixed(2)}</p>
                <p>Term Total: ${attainment.codeiumCoreRevenue.term.toFixed(2)}</p>
                <p>Annualized: ${attainment.codeiumCoreRevenue.annual.toFixed(2)}</p>
              </div>

              <div className="product-revenue total">
                <h4>Total Revenue</h4>
                <p>Monthly: ${(attainment.totalRevenue / termLength).toFixed(2)}</p>
                <p>Term Total: ${attainment.totalRevenue.toFixed(2)}</p>
                <p>Annualized: ${attainment.annualRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
