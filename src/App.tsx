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
  const [discount, setDiscount] = useState<string>('');
  const [termLength, setTermLength] = useState<string>('');
  const [revenue, setRevenue] = useState<{
    cascadeRevenue: {
      monthly: number;
      term: number;
      quotaAttainment: number;
    };
    codeiumCoreRevenue: {
      monthly: number;
      term: number;
      quotaAttainment: number;
      discountAmount: number;
    };
    totalRevenue: {
      monthly: number;
      term: number;
      quotaAttainment: number;
    };
  } | null>(null);

  const calculateRevenue = () => {
    // Convert string inputs to numbers, defaulting to 0 if empty
    const numericDiscount = discount === '' ? 0 : Number(discount);
    const numericTermLength = termLength === '' ? 0 : Number(termLength);

    // Validate inputs
    if (numericTermLength <= 0) {
      alert('Please enter a valid term length');
      return;
    }

    const discountMultiplier = 1 - (numericDiscount / 100);
    
    // Calculate Cascade revenue and quota attainment (no discount)
    const monthlyCascadeRevenue = users * selectedProduct.cascadeListPrice;
    const cascadeQuotaAttainment = users * selectedProduct.cascadeQuotaAttainment * numericTermLength;
    
    // Calculate Codeium Core revenue (with discount on list price)
    const baseMonthlyCodeiumRevenue = users * selectedProduct.codeiumCoreListPrice;
    const discountedMonthlyCodeiumRevenue = baseMonthlyCodeiumRevenue * discountMultiplier;
    const monthlyDiscountAmount = baseMonthlyCodeiumRevenue - discountedMonthlyCodeiumRevenue;
    
    // Calculate Codeium Core quota attainment and discount
    const codeiumCoreQuotaAttainment = users * selectedProduct.codeiumCoreQuotaAttainment * numericTermLength;
    const quotaDiscountAmount = monthlyDiscountAmount * numericTermLength;

    // Calculate total monthly revenue
    const monthlyTotalRevenue = monthlyCascadeRevenue + discountedMonthlyCodeiumRevenue;
    const termTotalRevenue = monthlyTotalRevenue * numericTermLength;
    
    // Calculate total quota attainment (sum of individual quotas)
    const totalTermQuotaAttainment = cascadeQuotaAttainment + codeiumCoreQuotaAttainment - quotaDiscountAmount;
    
    // Annualize if term length is greater than 12 months
    const totalQuotaAttainment = numericTermLength > 12 
      ? (totalTermQuotaAttainment / numericTermLength) * 12 
      : totalTermQuotaAttainment;

    setRevenue({
      cascadeRevenue: {
        monthly: monthlyCascadeRevenue,
        term: monthlyCascadeRevenue * numericTermLength,
        quotaAttainment: cascadeQuotaAttainment
      },
      codeiumCoreRevenue: {
        monthly: discountedMonthlyCodeiumRevenue,
        term: discountedMonthlyCodeiumRevenue * numericTermLength,
        quotaAttainment: codeiumCoreQuotaAttainment,
        discountAmount: quotaDiscountAmount
      },
      totalRevenue: {
        monthly: monthlyTotalRevenue,
        term: termTotalRevenue,
        quotaAttainment: totalQuotaAttainment
      }
    });
  };

  return (
    <div className="container">
      <h1>Quota Attainment Calculator</h1>
      
      <div className="input-section">
        <div className="input-group">
          <label>
            Product
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
            Number of Users
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
            Term Length (months)
            <input
              type="number"
              min="1"
              max="36"
              value={termLength}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || (Number(value) >= 1 && Number(value) <= 36)) {
                  setTermLength(value);
                }
              }}
              placeholder="Enter term length"
            />
          </label>
        </div>

        <div className="input-group">
          <label>
            Discount (%)
            <input
              type="number"
              min="0"
              max="100"
              value={discount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || (Number(value) >= 0 && Number(value) <= 100)) {
                  setDiscount(value);
                }
              }}
              placeholder="Enter discount"
            />
          </label>
        </div>

        <button onClick={calculateRevenue}>Calculate Quota Attained</button>
      </div>

      {revenue && (
        <div className="result">
          <h2>Revenue and Quota Attainment</h2>
          <div className="details">            
            <div className="product-revenue">
              <h4>Cascade Revenue</h4>
              <p className="unit-price">List Price per User: {formatCurrency(selectedProduct.cascadeListPrice)}</p>
              <p>Monthly: {formatCurrency(revenue.cascadeRevenue.monthly)}</p>
              <p>Term Total ({termLength || 0} months): {formatCurrency(revenue.cascadeRevenue.term)}</p>
              <p className="quota-attainment">Term Quota Attainment: {formatCurrency(revenue.cascadeRevenue.quotaAttainment)}</p>
            </div>

            <div className="product-revenue">
              <h4>Codeium Core Revenue {discount && `(with ${discount}% discount)`}</h4>
              <p className="unit-price">List Price per User: {formatCurrency(selectedProduct.codeiumCoreListPrice)}</p>
              <p className="unit-price">Discounted Price per User: {formatCurrency(selectedProduct.codeiumCoreListPrice * (1 - (Number(discount) || 0)/100))}</p>
              <p>Monthly: {formatCurrency(revenue.codeiumCoreRevenue.monthly)}</p>
              <p>Term Total ({termLength || 0} months): {formatCurrency(revenue.codeiumCoreRevenue.term)}</p>
              <p className="quota-attainment">Term Quota Attainment: {formatCurrency(revenue.codeiumCoreRevenue.quotaAttainment)}</p>
              <p className="discount">Total Discount: -{formatCurrency(revenue.codeiumCoreRevenue.discountAmount)}</p>
            </div>

            <div className="product-revenue total">
              <h4>Total Revenue</h4>
              <p>Monthly: {formatCurrency(revenue.totalRevenue.monthly)}</p>
              <p>Term Total ({termLength || 0} months): {formatCurrency(revenue.totalRevenue.term)}</p>
              <p className="quota-attainment">
                {Number(termLength) > 12 ? 'Total Annualized' : 'Total Term'} Quota Attainment: {formatCurrency(revenue.totalRevenue.quotaAttainment)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
