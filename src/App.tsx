import React, { useState } from 'react';

const App: React.FC = () => {
  const [revenue, setRevenue] = useState<number>(0);
  const [quota, setQuota] = useState<number>(0);
  const [attainment, setAttainment] = useState<number>(0);

  const calculateAttainment = () => {
    if (quota === 0) return;
    const calculatedAttainment = (revenue / quota) * 100;
    setAttainment(calculatedAttainment);
  };

  return (
    <div className="container">
      <h1>Quota Calculator</h1>
      <div className="input-group">
        <label>
          Revenue ($):
          <input
            type="number"
            value={revenue}
            onChange={(e) => setRevenue(Number(e.target.value))}
          />
        </label>
      </div>
      <div className="input-group">
        <label>
          Quota ($):
          <input
            type="number"
            value={quota}
            onChange={(e) => setQuota(Number(e.target.value))}
          />
        </label>
      </div>
      <button onClick={calculateAttainment}>Calculate Attainment</button>
      {attainment > 0 && (
        <div className="result">
          <h2>Quota Attainment: {attainment.toFixed(1)}%</h2>
        </div>
      )}
    </div>
  );
};

export default App;
