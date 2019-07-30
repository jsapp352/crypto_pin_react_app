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

    // Handle form text updates
    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    // Encrypt user-entered PIN data
    encryptPin()
    {
        var CryptoJS = require("crypto-js");

        // This secret key phrase must match the one on the API server.
        // Should be replaced with environment variable.
        const keyString = "donteverlookatme";

        // Convert the key string to a data array type
        var key = CryptoJS.enc.Utf8.parse(keyString);
        console.log(key);    

        // Encrypt the PIN
        var encryptedPinBytes = CryptoJS.AES.encrypt(this.state.pin, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });

        // Convert the encrypted PIN data array to a hex string
        var encryptedPinHexString = encryptedPinBytes.ciphertext.toString();
        console.log(`PIN ${this.state.pin}: ${encryptedPinHexString}`);

        this.decryptPin(encryptedPinHexString)

        return encryptedPinHexString;
    }

    decryptPin(encryptedPinString)
    {
        var CryptoJS = require("crypto-js");

        // This secret key phrase must match the one on the API server.
        // Should be replaced with environment variable.
        const keyString = "donteverlookatme";

        // Convert the key string to a data array type
        var key = CryptoJS.enc.Utf8.parse(keyString);
        console.log(key);

        // Convert the plain text hex representation of the PIN to a Base64 string
        var pinBytes = CryptoJS.enc.Hex.parse(encryptedPinString);
        var ciphertext = pinBytes.toString(CryptoJS.enc.Base64);

        // Decrypt the PIN
        var decryptedPinBytes = CryptoJS.AES.decrypt(ciphertext, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7,
        });

        // Convert the decryption results to a plain text string
        var decryptedPinPlainText = decryptedPinBytes.toString(CryptoJS.enc.Utf8);

        // // Only include this for debugging
        // console.log(`Decrypted PIN ${decryptedPinPlainText}`);


        return decryptedPinPlainText;
    }

    // Send an encrypted PIN to get user data from the API server
    getTa()
    {
        const encryptedPin = encodeURIComponent(this.encryptPin());

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