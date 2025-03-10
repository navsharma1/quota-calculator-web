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
    cascadeListPrice: 44,
    codeiumCoreListPrice: 29,
    cascadeQuotaAttainment: 14,
    codeiumCoreQuotaAttainment: 29
  },
  {
    name: 'Cloud Flow Standard',
    cascadeListPrice: 99,
    codeiumCoreListPrice: 29,
    cascadeQuotaAttainment: 29,
    codeiumCoreQuotaAttainment: 29
  },
  {
    name: 'Hybrid Flow Entry',
    cascadeListPrice: 44,
    codeiumCoreListPrice: 39,
    cascadeQuotaAttainment: 14,
    codeiumCoreQuotaAttainment: 39
  },
  {
    name: 'Hybrid Flow Standard',
    cascadeListPrice: 99,
    codeiumCoreListPrice: 39,
    cascadeQuotaAttainment: 29,
    codeiumCoreQuotaAttainment: 39
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
  const [users, setUsers] = useState<string>('');
  const [discount, setDiscount] = useState<string>('');
  const [unitPrice, setUnitPrice] = useState<string>('');
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
    const numericUsers = users === '' ? 0 : Number(users);
    const numericTermLength = termLength === '' ? 0 : Number(termLength);
    const numericUnitPrice = unitPrice === '' ? 0 : Number(unitPrice);
    
    // Calculate total list price
    const totalListPrice = selectedProduct.cascadeListPrice + selectedProduct.codeiumCoreListPrice;
    
    // Handle discount and unit price calculations
    let discountMultiplier = 1;
    let effectiveDiscount = 0;
    
    if (discount !== '') {
      // If discount is provided, use it directly for Codeium Core
      effectiveDiscount = Number(discount);
      discountMultiplier = 1 - (effectiveDiscount / 100);
    } else if (unitPrice !== '') {
      // If unit price is provided, calculate the effective discount on Codeium Core
      // The difference between total list price and desired unit price should be taken entirely from Codeium Core
      const desiredCodeiumPrice = numericUnitPrice - selectedProduct.cascadeListPrice;
      effectiveDiscount = ((selectedProduct.codeiumCoreListPrice - desiredCodeiumPrice) / selectedProduct.codeiumCoreListPrice) * 100;
      discountMultiplier = desiredCodeiumPrice / selectedProduct.codeiumCoreListPrice;
    }

    // Validate inputs
    if (numericTermLength <= 0) {
      alert('Please enter a valid term length');
      return;
    }

    if (numericUsers <= 0) {
      alert('Please enter a valid number of users');
      return;
    }

    if (unitPrice !== '' && (numericUnitPrice < selectedProduct.cascadeListPrice || numericUnitPrice > totalListPrice)) {
      alert(`Please enter a price between ${formatCurrency(selectedProduct.cascadeListPrice)} and ${formatCurrency(totalListPrice)}`);
      return;
    }

    if (effectiveDiscount < 0 || effectiveDiscount > 100) {
      alert('Please enter a valid discount (0-100%) or unit price');
      return;
    }
    
    // Calculate Cascade revenue and quota attainment (no discount)
    const monthlyCascadeRevenue = numericUsers * selectedProduct.cascadeListPrice;
    const cascadeQuotaAttainment = numericUsers * selectedProduct.cascadeQuotaAttainment * numericTermLength;
    
    // Calculate Codeium Core revenue (with discount on list price)
    const baseMonthlyCodeiumRevenue = numericUsers * selectedProduct.codeiumCoreListPrice;
    const discountedMonthlyCodeiumRevenue = baseMonthlyCodeiumRevenue * discountMultiplier;
    const monthlyDiscountAmount = baseMonthlyCodeiumRevenue - discountedMonthlyCodeiumRevenue;
    
    // Calculate Codeium Core quota attainment and discount
    const codeiumCoreQuotaAttainment = numericUsers * selectedProduct.codeiumCoreQuotaAttainment * numericTermLength;
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
              min="1"
              value={users}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || (Number(value) >= 1)) {
                  setUsers(value);
                }
              }}
              placeholder="Enter number of users"
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
                  setUnitPrice(''); // Clear unit price when discount is entered
                }
              }}
              placeholder="Enter discount"
            />
          </label>
        </div>

        <div className="input-group">
          <label>
            Unit Price ($)
            <input
              type="number"
              step="0.01"
              value={unitPrice}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || !isNaN(Number(value))) {
                  setUnitPrice(value);
                  setDiscount(''); // Clear discount when unit price is entered
                }
              }}
              placeholder={`Enter amount (${formatCurrency(selectedProduct.cascadeListPrice)} - ${formatCurrency(selectedProduct.cascadeListPrice + selectedProduct.codeiumCoreListPrice)})`}
            />
          </label>
        </div>

        <button onClick={calculateRevenue}>Calculate Quota Attained</button>
      </div>

      {revenue && (
        <div className="results">
          <div className="revenue-breakdown">
            <div className="product-revenue total">
              <h3>Total Revenue</h3>
              <p>Monthly: {formatCurrency(revenue.totalRevenue.monthly)}</p>
              <p>Term Total ({termLength || 0} months): {formatCurrency(revenue.totalRevenue.term)}</p>
              <p className="quota-attainment">
                {Number(termLength) > 12 ? 'Total Annualized' : 'Total Term'} Quota Attainment: {formatCurrency(revenue.totalRevenue.quotaAttainment)}
              </p>
            </div>

            <h3>Quota Attainment Breakout</h3>
            <div className="breakout-container">
              <div className="product-revenue">
                <h4>Cascade Revenue</h4>
                <p className="unit-price">List Price per User: {formatCurrency(selectedProduct.cascadeListPrice)}</p>
                <p>Monthly: {formatCurrency(revenue.cascadeRevenue.monthly)}</p>
                <p>Term Total ({termLength || 0} months): {formatCurrency(revenue.cascadeRevenue.term)}</p>
                <p className="quota-attainment">Term Quota Attainment: {formatCurrency(revenue.cascadeRevenue.quotaAttainment)}</p>
              </div>

              <div className="product-revenue">
                <h4>Codeium Core Revenue {(discount || unitPrice) && 
                  `(with ${discount ? `${discount}% discount` : 
                    `$${(Number(unitPrice) - selectedProduct.cascadeListPrice).toFixed(2)} unit price (${((selectedProduct.codeiumCoreListPrice - (Number(unitPrice) - selectedProduct.cascadeListPrice)) / selectedProduct.codeiumCoreListPrice * 100).toFixed(1)}% discount)`})`}</h4>
                <p className="unit-price">List Price per User: {formatCurrency(selectedProduct.codeiumCoreListPrice)}</p>
                <p className="unit-price">Discounted Price per User: {formatCurrency(
                  selectedProduct.codeiumCoreListPrice * (
                    discount ? (1 - Number(discount)/100) :
                    unitPrice ? ((Number(unitPrice) - selectedProduct.cascadeListPrice) / selectedProduct.codeiumCoreListPrice) :
                    1
                  )
                )}</p>
                <p>Monthly: {formatCurrency(revenue.codeiumCoreRevenue.monthly)}</p>
                <p>Term Total ({termLength || 0} months): {formatCurrency(revenue.codeiumCoreRevenue.term)}</p>
                <p className="quota-attainment">Term Quota Attainment: {formatCurrency(revenue.codeiumCoreRevenue.quotaAttainment)}</p>
                <p className="discount">Total Discount: -{formatCurrency(revenue.codeiumCoreRevenue.discountAmount)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
