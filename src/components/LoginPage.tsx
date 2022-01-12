import React, { useState } from 'react';
import { Redirect } from "react-router-dom";

interface IProps {
    setisLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
    setslToken: React.Dispatch<React.SetStateAction<string>>
}

const LoginPage: React.FC<IProps> = ({ setisLoggedIn, setslToken }) => {

    const [errorMessage, seterrorMessage] = useState("");
    const [loginDetails, setloginDetails] = useState({
        name: "",
        email: ""
    })

    const [redirect, setredirect] = useState("");

    // handles input fields changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setloginDetails({
            ...loginDetails,
            [e.target.name]: e.target.value
        })
    }

    // submit function
    const handleSubmit = () => {
        fetch("https://api.supermetrics.com/assignment/register", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                client_id: "ju16a6m81mhid5ue1z3v2g0uh",
                email: loginDetails.email,
                name: loginDetails.name
            })
        })
        .then(function(response) {
            return response.json();
        }).then(function(payload) {             
            if ("data" in payload) {
                // if successful authentication
                setslToken(payload.data.sl_token)
                setisLoggedIn(true);
                // store token in local storage so the login can persist
                localStorage.setItem('sl_token', JSON.stringify({sl_token:payload.data.sl_token}));
                // redirect to posts page
                setredirect("/posts")
            } else { 
                // if failed authentication               
                const error = payload.error.message;               
                seterrorMessage(error);
            }            
        });        
    }

    // if successful authentication
    if (redirect) {
        return (
            <Redirect to="/posts"/>
        )
    }

    return (
        <div className='login-page'>
            <h1>Sign In</h1>
            <div className='login-form'>
                <input className='login-input' type="text" placeholder='Name' name='name' value={loginDetails.name} onChange={handleChange}/>
                <input className='login-input' type="email" placeholder='Email' name="email" value={loginDetails.email} onChange={handleChange} />
                <button className='login-btn' onClick={handleSubmit}>Submit</button>
                <br />
                {
                    errorMessage ? <p style={{ color: 'red' }}>Error: {errorMessage}</p> : ""
                }         
            </div>
        </div>
    )
}

export default LoginPage;