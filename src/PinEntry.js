import React from 'react';

class PinEntry extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            pin: null,
            taName: null
        };

        this.getTa = this.getTa.bind(this);
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    encryptPin()
    {
        var CryptoJS = require("crypto-js");

        const keyString = "donteverlookatme";
        console.log(keyString);

        var key = CryptoJS.enc.Utf8.parse(keyString);
        console.log(key);    

        var encryptedPinBytes = CryptoJS.AES.encrypt(this.state.pin, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });

        var encryptedPinHexString = encryptedPinBytes.ciphertext.toString();
        console.log(`PIN ${this.state.pin}: ${encryptedPinHexString}`);

        return encryptedPinHexString;
    }

    getTa()
    {
        const encryptedPin = encodeURIComponent(this.encryptPin());

        // //DEBUG
        // this.setState({ taName: encryptedPin })

        const options = {
            method: 'GET',
            headers: { "Content-Type": "application/json; charset=UTF-8" },
        };

        fetch(`https://secret-reaches-21294.herokuapp.com/instructor/pin/?encryptedPin=${encryptedPin}`, options)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.setState({taName: data.name});
            })
    }

    render()
    {
        return (
            <div className="pin-entry">
                <h1>Enter PIN:</h1>                        

                    <input type="text" onChange={this.handleChange} id="pin" />

                    <button type="submit" onClick={this.getTa} className="btn btn-primary">Submit</button> 

                    <br /><br />

                    {this.state.taName}             
            </div>
            

        );
    }
}

export default PinEntry;