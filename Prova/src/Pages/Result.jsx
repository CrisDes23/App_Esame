import React from "react";
import {useNavigate} from 'react-router-dom';

export function Result(){
    const navigate = useNavigate();

    const GoToSelect = () => {
        navigate('/Select');
    };






    return(
        <div>
            <h1>Benevnuto su Outfitly</h1>
        </div>
    );
}



export default Result;