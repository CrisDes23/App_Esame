import React from "react";
import {useNavigate} from 'react-router-dom';
import '../Pages_Style/Welcome.css';

export function Welcome(){
    const navigate = useNavigate();

    const GoToSelect = () => {
        navigate('/Select');
    };






    return(
        <div>
            <h1 className="welcome">Benevnuto su Outfitly</h1>
            <p className="desc-App">Outfitly è un sito per ...</p>
            <button className="GoToSelect" onClick={GoToSelect}>
                Next Page
            </button>
        </div>
    );
}



export default Welcome;