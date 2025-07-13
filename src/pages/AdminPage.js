import React, { useState, useEffect } from 'react';
import { packageService } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './AdminPage.css';

const AdminPage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const fibreResponse = await packageService.getFibrePackages();
        const lteResponse = await packageService.getLTEPackages();
        
        const fibrePackages = fibreResponse.data.data || [];
        const ltePackages = lteResponse.data.data || [];

        setPackages([...fibrePackages, ...ltePackages]);
      } catch (err) {
        setError('Failed to load packages.');
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) {
    return <div className="loading-container"><LoadingSpinner /></div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="admin-page">
      <div className="container">
        <h1>Package Management</h1>
        <div className="packages-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Provider</th>
                <th>Price</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg.id}>
                  <td>{pkg.title}</td>
                  <td>{pkg.provider}</td>
                  <td>{pkg.price}</td>
                  <td>{pkg.type}</td>
                  <td>
                    <button className="btn-edit">Edit</button>
                    <button className="btn-delete">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;