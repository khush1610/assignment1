import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get-table-data');
        setTableData(response.data);
      } catch (err) {
        setError('Failed to fetch table data');
      }
    };
    fetchTableData();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/process-csv');
      console.log('Response from backend:', response.data);

      setResults({
        alpha: response.data.alpha,
        beta: response.data.beta,
        charlie: response.data.charlie,
      });
    } catch (err) {
      setError('Failed to fetch results from backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>CSV Table and Results</h1>

      {tableData.length > 0 && (
        <div>
          <h2>CSV Table Data</h2>
          <table border="1">
            <thead>
              <tr>
                <th>Index #</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td>{row['Index #']}</td>
                  <td>{row.Value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {error && <p className="error">{error}</p>}

      <button onClick={fetchResults} disabled={loading}>
        Fetch Results
      </button>

      {results && (
        <div>
          <h2>Calculated Results</h2>
          <table border="1">
            <thead>
              <tr>
                <th>Category</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Alpha</td>
                <td>{results.alpha}</td>
              </tr>
              <tr>
                <td>Beta</td>
                <td>{results.beta}</td>
              </tr>
              <tr>
                <td>Charlie</td>
                <td>{results.charlie}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
