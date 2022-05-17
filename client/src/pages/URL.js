import { Form, Button, Col, Row, Container } from "react-bootstrap";
import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import ColorPicker from "../components/ColorPicker";
import Size from "../components/Size";

// Used for URL validation


const URL = () => {
    // Setup states
    const [qrCode, setQrCode] = useState({});
    const [validUrl, setValidUrl] = useState(false)
    const [checkUrl, setCheckUrl] = useState(true)
    const [timer, setTimer] = useState(null)
    const navigate = useNavigate();


    const validUrlRequest = async (url) => {
        setCheckUrl(true)

        // Send 
        const res = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({"url": url}),
        };

        const response = await fetch("/url_checker", res);
        const data = await response.json();
        
        console.log(data)
        if (data.status_code === 301 || data.status_code === 200) {
            setValidUrl(true)
            setCheckUrl(false)
        }
        else {
            setValidUrl(false)
            setCheckUrl(false)
        }

    }

    const handleUrlValidation = async (event) => {
        setQrCode((newUrl) => ({ ...newUrl, url: event.target.value }))
        qrCode.url = event.target.value
        clearTimeout(timer)
        const newTimer = setTimeout(() => {
            console.log("sending request");
            validUrlRequest(qrCode.url)
        }, 1000)

        setTimer(newTimer)
    }



    const create_request = async (e) => {
        e.preventDefault();
        console.log(JSON.stringify(qrCode));
        const res = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(qrCode),
        };

        const response = await fetch("/create/URL-QR-Code", res);
        const data = await response.json();

        console.log(data);

        if (data.success) {
            console.log("success");
            navigate(`/get-QR-Code/${data.success}`, { state: data.success });
        } else alert(`${data.error}`);
    };

    console.log(
        `URL: ${qrCode.url}\nStatus: ${validUrl}\nCheck: ${checkUrl}`
    );
    // Fill_color: ${qrCode.fill_color}\nBack_color: ${qrCode.back_color}\nSize: ${qrCode.size}
    return (
        <div className="container border-success">
            <div className="row border-success">
                <div className="col border-success">
                    <h1>Type: URL</h1>
                </div>
            </div>
            <div className="row border-success justify-content-center">
                {/* BEGIN FORM */}
                <form onSubmit={create_request} className="col-6 form-group border">
                    {/* BEGIN URL INPUT */}
                    <div className="text-left mt-5">
                        <label htmlFor="url" className="align-top">
                            Url
                        </label>
                        <input
                            type="text"
                            name="url"
                            id=""
                            required
                            className={(validUrl) ? "form-control is-valid": (!validUrl && !checkUrl) ? "form-control is-invalid" : "form-control"} 
                            autoComplete="off"
                            
                            onChange={handleUrlValidation}
                        />
                    {!validUrl && !checkUrl ? (
                        <small className="text-danger">"{qrCode.url}" is not a valid URL.</small>
                    ) : (
                        <div hidden className=""></div>
                    )}
                    </div>

                    {/* END URL INPUT */}

                    <ColorPicker setQrCode={setQrCode} />

                    <Size setQrCode={setQrCode} />

                    {/* BEGIN VERSION INPUT */}
                    {/* <div className="text-left mt-3">
                        <label htmlFor="version" className="align-top">
                            Version #
                        </label>
                        <input
                            type="number"
                            name="version"
                            min="1"
                            max="40"
                            id=""
                            className="form-control"
                        />
                        <small className="text-muted">Version # default is one</small>
                    </div> */}
                    {/* END VERSION INPUT */}

                    <input className="m-5" type="submit" value="Generate QR Code" />
                </form>
                {/* END FORM */}
            </div>
        </div>
    );
};

export default URL;
