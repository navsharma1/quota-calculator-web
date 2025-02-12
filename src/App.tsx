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
  const [discount, setDiscount] = useState<number>(0);
  const [termLength, setTermLength] = useState<number>(12); // Default to annual
  const [revenue, setRevenue] = useState<{
    cascadeRevenue: {
      monthly: number;
      term: number;
      annual: number;
    };
    codeiumCoreRevenue: {
      monthly: number;
      term: number;
      annual: number;
      discountAmount: number;
    };
    totalRevenue: {
      monthly: number;
      term: number;
      annual: number;
    };
  } | null>(null);

  const calculateRevenue = () => {
    const discountMultiplier = 1 - (discount / 100);
    
    // Calculate Cascade revenue (no discount)
    const monthlyCascadeRevenue = units * selectedProduct.cascadeListPrice;
    
    // Calculate Codeium Core revenue (with discount)
    const baseMonthlyCodeiumRevenue = units * selectedProduct.codeiumCoreListPrice;
    const discountedMonthlyCodeiumRevenue = baseMonthlyCodeiumRevenue * discountMultiplier;
    const monthlyDiscountAmount = baseMonthlyCodeiumRevenue - discountedMonthlyCodeiumRevenue;

    // Calculate total monthly revenue
    const monthlyTotalRevenue = monthlyCascadeRevenue + discountedMonthlyCodeiumRevenue;

    setRevenue({
      cascadeRevenue: {
        monthly: monthlyCascadeRevenue,
        term: monthlyCascadeRevenue * termLength,
        annual: monthlyCascadeRevenue * 12
      },
      codeiumCoreRevenue: {
        monthly: discountedMonthlyCodeiumRevenue,
        term: discountedMonthlyCodeiumRevenue * termLength,
        annual: discountedMonthlyCodeiumRevenue * 12,
        discountAmount: monthlyDiscountAmount * termLength
      },
      totalRevenue: {
        monthly: monthlyTotalRevenue,
        term: monthlyTotalRevenue * termLength,
        annual: monthlyTotalRevenue * 12
      }
    });
  };

  return (
    <div className="container">
      <h1>Revenue Calculator</h1>
      
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
          Codeium Core Discount (%):
          <input
            type="number"
            min="0"
            max="100"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
          />
        </label>
      </div>

      <button onClick={calculateRevenue}>Calculate Revenue</button>

      {revenue && (
        <div className="result">
          <h2>Revenue Breakdown</h2>
          <div className="details">            
            <div className="product-revenue">
              <h4>Cascade Revenue</h4>
              <p>Monthly: ${revenue.cascadeRevenue.monthly.toFixed(2)}</p>
              <p>Term Total: ${revenue.cascadeRevenue.term.toFixed(2)}</p>
              <p>Annualized: ${revenue.cascadeRevenue.annual.toFixed(2)}</p>
            </div>

            <div className="product-revenue">
              <h4>Codeium Core Revenue (with {discount}% discount)</h4>
              <p>Monthly: ${revenue.codeiumCoreRevenue.monthly.toFixed(2)}</p>
              <p>Term Total: ${revenue.codeiumCoreRevenue.term.toFixed(2)}</p>
              <p>Annualized: ${revenue.codeiumCoreRevenue.annual.toFixed(2)}</p>
              <p className="discount">Total Discount: -${revenue.codeiumCoreRevenue.discountAmount.toFixed(2)}</p>
            </div>

            <div className="product-revenue total">
              <h4>Total Revenue</h4>
              <p>Monthly: ${revenue.totalRevenue.monthly.toFixed(2)}</p>
              <p>Term Total: ${revenue.totalRevenue.term.toFixed(2)}</p>
              <p>Annualized: ${revenue.totalRevenue.annual.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
