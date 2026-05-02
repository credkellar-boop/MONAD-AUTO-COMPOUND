// frontend/src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [compounding, setCompounding] = useState(false);

    const fetchStatus = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/status');
            setStatus(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching status:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const triggerCompound = async () => {
        setCompounding(true);
        try {
            const response = await axios.post('http://localhost:5000/api/trigger-compound');
            alert(response.data.success ? `Compounded ${response.data.amount} tokens!` : 'No rewards to compound.');
        } catch (error) {
            console.error("Error triggering compound:", error);
            alert('Failed to trigger compound.');
        }
        setCompounding(false);
        fetchStatus();
    };

    if (loading) return <div>Loading vault data...</div>;

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '500px', margin: '20px auto' }}>
            <h2>Vault Status</h2>
            {status ? (
                <div>
                    <p><strong>Network:</strong> {status.network}</p>
                    <p><strong>Operator Address:</strong> {status.address}</p>
                    <p><strong>Native Balance:</strong> {status.nativeBalance} MONAD</p>
                    <p><strong>Bot Status:</strong> <span style={{ color: 'green' }}>{status.status}</span></p>
                    
                    <button 
                        onClick={triggerCompound} 
                        disabled={compounding}
                        style={{ padding: '10px 20px', marginTop: '15px', cursor: 'pointer' }}
                    >
                        {compounding ? 'Compounding...' : 'Force Compound Now'}
                    </button>
                </div>
            ) : (
                <p>Failed to load status. Is the backend running?</p>
            )}
        </div>
    );
};

export default Dashboard;
