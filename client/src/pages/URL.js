import { Form, Button, Col, Row, Container } from "react-bootstrap";
import { React, useState, useEffect } from "react";

const URL = () => {
    // Setup states
    const [qrCode, setqrCode] = useState({});

    const create_request = async (e) => {
        console.log(JSON.stringify(qrCode));
        const res = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(qrCode),
        };

        const response = await fetch("/create/URL-QR-Code", res);
        // const data = await response.json();

        console.log(response);
    };

    console.log(`URL: ${qrCode.url}\nFill_color: ${qrCode.fill_color}`);
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
                            onChange={(event) =>
                                setqrCode((newUrl) => ({ ...newUrl, url: event.target.value }))
                            }
                        />
                    </div>
                    {/* END URL INPUT */}
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

                    {/* BEGIN COLOR INPUT */}
                    <div className="text-left mt-3">
                        <label htmlFor="back_color" className="align-top">
                            Pick Dark Color
                        </label>
                        <input
                            type="color"
                            name="back_color"
                            id=""
                            className="form-control"
                            onChange={(event) =>
                                setqrCode((newFillColor) => ({
                                    ...newFillColor,
                                    back_color: event.target.value,
                                }))
                            }
                        />
                        <small className="text-muted">
                            This should be a relatively darker color
                        </small>
                    </div>

                    <div className="text-left mt-3">
                        <label htmlFor="fill_color" className="align-top">
                            Pick Lighter Color
                        </label>
                        <input
                            type="color"
                            name="fill_color"
                            id=""
                            className="form-control"
                            onChange={(event) =>
                                setqrCode((newFillColor) => ({
                                    ...newFillColor,
                                    fill_color: event.target.value,
                                }))
                            }
                        />
                        <small className="text-muted">
                            This should be a relatively lighter color
                        </small>
                    </div>
                    {/* END COLOR INPUT */}

                    {/* BEGIN SIZE INPUT */}
                    <div className="text-left mt-3">
                        <label htmlFor="size" className="align-top">
                            Size
                        </label>
                        <input
                            type="number"
                            name="size"
                            id=""
                            min="1"
                            max="14"
                            className="form-control"
                            onChange={(event) =>
                                setqrCode((newSize) => ({
                                    ...newSize,
                                    size: event.target.value,
                                }))
                            }
                        />
                        <small className="text-muted">How large you want your QR code to be</small>
                    </div>
                    {/* END SIZE INPUT */}
                    <input className="m-5" type="submit" value="Generate QR Code" />
                </form>
                {/* END FORM */}
            </div>
        </div>
    );
};

export default URL;
