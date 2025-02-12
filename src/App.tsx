import React, { useState } from 'react';

interface Product {
  name: string;
  cascadeListPrice: number;
  codeiumCoreListPrice: number;
  cascadeQuotaAttainment: number;
  codeiumCoreQuotaAttainment: number;
}

const products: Product[] = [
  {
    name: 'Cloud Flow Entry',
    cascadeListPrice: 44.00,
    codeiumCoreListPrice: 29.00,
    cascadeQuotaAttainment: 14.00,
    codeiumCoreQuotaAttainment: 29.00
  },
  {
    name: 'Cloud Flow Standard',
    cascadeListPrice: 99.00,
    codeiumCoreListPrice: 29.00,
    cascadeQuotaAttainment: 29.00,
    codeiumCoreQuotaAttainment: 29.00
  },
  {
    name: 'Hybrid Flow Entry',
    cascadeListPrice: 44.00,
    codeiumCoreListPrice: 39.00,
    cascadeQuotaAttainment: 14.00,
    codeiumCoreQuotaAttainment: 39.00
  },
  {
    name: 'Hybrid Flow Standard',
    cascadeListPrice: 99.00,
    codeiumCoreListPrice: 39.00,
    cascadeQuotaAttainment: 29.00,
    codeiumCoreQuotaAttainment: 39.00
  }
];

const termOptions = [
  { value: 1, label: '1 Month' },
  { value: 3, label: '3 Months' },
  { value: 6, label: '6 Months' },
  { value: 9, label: '9 Months' },
  { value: 12, label: '12 Months (1 Year)' },
  { value: 24, label: '24 Months (2 Years)' },
  { value: 36, label: '36 Months (3 Years)' }
];

// Currency formatter
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const App: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);
  const [users, setUsers] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [termLength, setTermLength] = useState<number>(12); // Default to annual
  const [revenue, setRevenue] = useState<{
    cascadeRevenue: {
      monthly: number;
      term: number;
      annual: number;
      quotaAttainment: number;
    };
    codeiumCoreRevenue: {
      monthly: number;
      term: number;
      annual: number;
      quotaAttainment: number;
      discountAmount: number;
    };
    totalRevenue: {
      monthly: number;
      term: number;
      annual: number;
      quotaAttainment: number;
    };
  } | null>(null);

  const calculateRevenue = () => {
    const discountMultiplier = 1 - (discount / 100);
    const annualizationMultiplier = 12 / termLength;
    
    // Calculate Cascade revenue and quota attainment (no discount)
    const monthlyCascadeRevenue = users * selectedProduct.cascadeListPrice;
    const cascadeQuotaAttainment = users * selectedProduct.cascadeQuotaAttainment * annualizationMultiplier;
    
    // Calculate Codeium Core revenue and quota attainment (with discount)
    const baseMonthlyCodeiumRevenue = users * selectedProduct.codeiumCoreListPrice;
    const discountedMonthlyCodeiumRevenue = baseMonthlyCodeiumRevenue * discountMultiplier;
    const monthlyDiscountAmount = baseMonthlyCodeiumRevenue - discountedMonthlyCodeiumRevenue;
    const codeiumCoreQuotaAttainment = users * selectedProduct.codeiumCoreQuotaAttainment * annualizationMultiplier;

    // Calculate total monthly revenue and quota attainment
    const monthlyTotalRevenue = monthlyCascadeRevenue + discountedMonthlyCodeiumRevenue;
    const totalQuotaAttainment = cascadeQuotaAttainment + codeiumCoreQuotaAttainment;

    setRevenue({
      cascadeRevenue: {
        monthly: monthlyCascadeRevenue,
        term: monthlyCascadeRevenue * termLength,
        annual: monthlyCascadeRevenue * 12,
        quotaAttainment: cascadeQuotaAttainment
      },
      codeiumCoreRevenue: {
        monthly: discountedMonthlyCodeiumRevenue,
        term: discountedMonthlyCodeiumRevenue * termLength,
        annual: discountedMonthlyCodeiumRevenue * 12,
        quotaAttainment: codeiumCoreQuotaAttainment,
        discountAmount: monthlyDiscountAmount * termLength
      },
      totalRevenue: {
        monthly: monthlyTotalRevenue,
        term: monthlyTotalRevenue * termLength,
        annual: monthlyTotalRevenue * 12,
        quotaAttainment: totalQuotaAttainment
      }
    });
  };

  return (
    <div className="container">
      <h1>Quota Attainment</h1>
      
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
                {product.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="input-group">
        <label>
          Number of Users:
          <input
            type="number"
            min="0"
            value={users}
            onChange={(e) => setUsers(Number(e.target.value))}
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

      <button onClick={calculateRevenue}>Calculate Quota Attained</button>

      {revenue && (
        <div className="result">
          <h2>Revenue and Quota Attainment</h2>
          <div className="details">            
            <div className="product-revenue">
              <h4>Cascade Revenue</h4>
              <p>Monthly: {formatCurrency(revenue.cascadeRevenue.monthly)}</p>
              <p>Term Total: {formatCurrency(revenue.cascadeRevenue.term)}</p>
              <p>Annualized: {formatCurrency(revenue.cascadeRevenue.annual)}</p>
              <p className="quota-attainment">Annualized Quota Attainment: {formatCurrency(revenue.cascadeRevenue.quotaAttainment)}</p>
            </div>

            <div className="product-revenue">
              <h4>Codeium Core Revenue (with {discount}% discount)</h4>
              <p>Monthly: {formatCurrency(revenue.codeiumCoreRevenue.monthly)}</p>
              <p>Term Total: {formatCurrency(revenue.codeiumCoreRevenue.term)}</p>
              <p>Annualized: {formatCurrency(revenue.codeiumCoreRevenue.annual)}</p>
              <p className="quota-attainment">Annualized Quota Attainment: {formatCurrency(revenue.codeiumCoreRevenue.quotaAttainment)}</p>
              <p className="discount">Total Discount: -{formatCurrency(revenue.codeiumCoreRevenue.discountAmount)}</p>
            </div>

            <div className="product-revenue total">
              <h4>Total Revenue</h4>
              <p>Monthly: {formatCurrency(revenue.totalRevenue.monthly)}</p>
              <p>Term Total: {formatCurrency(revenue.totalRevenue.term)}</p>
              <p>Annualized: {formatCurrency(revenue.totalRevenue.annual)}</p>
              <p className="quota-attainment">Total Annualized Quota Attainment: {formatCurrency(revenue.totalRevenue.quotaAttainment)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
