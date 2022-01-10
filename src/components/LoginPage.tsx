import React, { useState } from 'react';

interface IProps {
    setisLoggedIn: React.Dispatch<React.SetStateAction<any>>
    setslToken: React.Dispatch<React.SetStateAction<string>>
}

const LoginPage: React.FC<IProps> = ({ setisLoggedIn, setslToken }) => {

    const [errorMessage, seterrorMessage] = useState("");

    const [loginDetails, setloginDetails] = useState({
        name: "",
        email: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setloginDetails({
            ...loginDetails,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = () => {
        console.log(loginDetails);
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
                // successful authentication
                setslToken(payload.data.sl_token)
                setisLoggedIn(true);
            } else { 
                // failed authentication               
                const error = payload.error.message;               
                seterrorMessage(error);
            }            
        });        
    }

    return (
        <div>
            <h2>Sign In</h2>
            <div>
                <input type="text" placeholder='Name' name='name' value={loginDetails.name} onChange={handleChange}/>
                <input type="email" placeholder='Email' name="email" value={loginDetails.email} onChange={handleChange} />
                <button onClick={handleSubmit}>Submit</button>
                <br />
                {
                    errorMessage ? <p>{errorMessage}</p> : ""
                }         
            </div>
        </div>
    )
}

export default LoginPage;