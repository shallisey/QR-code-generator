import { Form, Button, Col, Row, Container } from "react-bootstrap";
import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import ColorPicker from "../components/ColorPicker";
import Size from "../components/Size";

const URL = () => {
    // Setup states
    const [qrCode, setQrCode] = useState({});
    const navigate = useNavigate();

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
        }
    };

    console.log(
        `URL: ${qrCode.url}\nFill_color: ${qrCode.fill_color}\nBack_color: ${qrCode.back_color}\nSize: ${qrCode.size}`
    );
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
                            className="form-control"
                            autocomplete="off"
                            onChange={(event) =>
                                setQrCode((newUrl) => ({ ...newUrl, url: event.target.value }))
                            }
                        />
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
