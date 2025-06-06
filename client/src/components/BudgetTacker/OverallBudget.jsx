import React from "react";
import { useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useBudget } from "../BudgetContext";
import ErrorHandler from "../ErrorHandler";

export default function OverallBudget({}){
    const { getAccessTokenSilently } = useAuth0();
    const [overallBudget, setOverallBudget] = useState(0);
    const {savedOverallBudget, setSavedOverallBudget} = useBudget();
    const [error, setError] = useState(null);

    const fetchOverallBudget = async () => {
        try {
            const token = await getAccessTokenSilently();
            const res = await axios.get('http://localhost:3000/api/overall-budget', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if(res.data){
                setOverallBudget(res.data.overallBudget);
                setSavedOverallBudget(res.data.overallBudget);
            }
        } catch (error) {
            console.error('Failed to fetch budget: ', error);
        }
    }


const handleSaveOverallBudget = async () => {
    try {
        const token = await getAccessTokenSilently();
        const res = await axios.post('http://localhost:3000/api/overall-budget', 
            { totalBudget: overallBudget },
            { headers: {Authorization: `Bearer ${token}`}}
        
        )
        setOverallBudget(res.data.overallBudget || 0);
        setSavedOverallBudget(res.data.overallBudget);
    } catch (error) {
        console.error('Failed to save! ', error);
    }
}
    useEffect(() => {
    fetchOverallBudget();
    setSavedOverallBudget(savedOverallBudget);
}, [getAccessTokenSilently, savedOverallBudget]);

    return(
        <div className="container mt-4">
            <ErrorHandler error={error} clearError={() => setError(null)} />
            <div className="row">
                <div className=" col-md-8">
                    <div className="input-group  mb-3">
                        <span className="input-group-text">Budget:</span>
                        <span className="input-group-text">$</span>
                        <input 
                            type="number" 
                            className="form-control"
                            value={overallBudget}
                            onChange={(e) => setOverallBudget(Number(e.target.value))}
                        />
                    </div>
                </div>
                <div className="col md-2 mb-3">
                    {/* <button className="btn btn-outline-warning me-2">Update</button> */}
                    <button className="btn btn-outline-primary" onClick={handleSaveOverallBudget}>Save</button>
                </div>
            </div>
            <div className="mb-5">
                <h6>Your total budget: ${savedOverallBudget}</h6>
            </div>
        </div>

    )
}