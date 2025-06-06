// components/BudgetTracker/BudgetHeader.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

function Deneme()  {
    const [totalBudget, setTotalBudget] = useState(0);
    const [newBudget, setNewBudget] = useState(totalBudget);
    const { getAccessTokenSilently } =useAuth0();

    async function getBudget(){
        try {
            const token = await getAccessTokenSilently();
            const res = await axios.get('http://localhost:3000/api/budget', {
                headers: {Authorization: `Bearer ${token}`}
            })
            setTotalBudget(res.data)
        } catch (error) {
            console.error(error.message)
        }
    }

    useEffect(() => {
        getBudget()
    }, [])

    async function handleSaveBudget(){
        try {
            const token = await getAccessTokenSilently();
            const res = await axios.post('http://localhost:3000/api/budget', totalBudget, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setTotalBudget(res.data);
            res.status(201).json({message: `Your budget is ${totalBudget}`});
        } catch (error) {
            console.error(error)
        }
    }

  return (
    <div className="container mt-4">
        <div className='row g-2 align-items-end'>
            <div className='col-md-3 input-group'>
                <span className='input-group-text'>Total Budget:</span>
                <span className='input-group-text'>$</span>
                <input 
                    type='number'
                    className='form-control'
                    value={totalBudget}
                    onChange={e => setTotalBudget(Number(e.target.value))}
                />
            </div>
            <div className='col-md-3' style={{marginTop: '25px'}}>
                <button className="btn btn-warning" >Edit</button>
                <button className="btn btn-primary" onClick={() => handleSaveBudget()}>Save</button>
            </div>
        </div>
    </div>
  );
};

export default Deneme;
