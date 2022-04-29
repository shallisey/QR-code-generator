import React from "react";

function HomePage() {
    return (
        <div>
            <h1>Welcome to QR Code Generator/Reader</h1>
            <div className="container">
                <div className="row m-4 justify-content-center" id="qr-container">
                    <div className="">
                        <h3>Scan code for video instructions</h3>
                        <img className="photo" src="/site-qrcodes/youtube.png" />
                        <br></br>
                        <small>Just takes you to youtube homepage for now</small>
                    </div>
                </div>

                {/* <div className="row m-4 justify-content-center" id="written-instructions">
                    <div>
                        <h3 className="row">How to use this app</h3>
                        <br />
                        <p>[Instructions go here]</p>
                    </div>
                </div> */}
            </div>
        </div>
    );
}

export default HomePage;
