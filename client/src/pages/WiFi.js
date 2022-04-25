import { React, useState } from "react";
import { useNavigate } from "react-router-dom";

import ColorPicker from "../components/ColorPicker";
import Size from "../components/Size";

const WiFi = () => {
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
        `SSID: ${qrCode.ssid}\nPassword: ${qrCode.password}\nFill_color: ${qrCode.fill_color}\nBack_color: ${qrCode.back_color}\nSize: ${qrCode.size}`
    );
    return (
        <div className="container border-success">
            <div className="row border-success">
                <div className="col border-success">
                    <h1>Type: WiFi</h1>
                </div>
            </div>
            <div className="row border-success justify-content-center">
                {/* BEGIN FORM */}
                <form onSubmit={create_request} className="col-6 form-group border">
                    {/* BEGIN SSID INPUT */}
                    <div className="text-left mt-5">
                        <label htmlFor="url" className="align-top">
                            SSID
                        </label>
                        <input
                            type="text"
                            name="ssid"
                            id=""
                            required
                            className="form-control"
                            onChange={(event) =>
                                setQrCode((newSsid) => ({ ...newSsid, ssid: event.target.value }))
                            }
                        />
                        <small className="text-muted">
                            This is the name of your router that you connect to.
                        </small>
                    </div>

                    {/* END SSID INPUT */}

                    {/* BEGIN PASSWORD INPUT */}
                    <div className="text-left mt-3">
                        <label htmlFor="url" className="align-top">
                            Password
                        </label>
                        <input
                            type="text"
                            name="password"
                            id=""
                            required
                            className="form-control"
                            onChange={(event) =>
                                setQrCode((newPassword) => ({
                                    ...newPassword,
                                    password: event.target.value,
                                }))
                            }
                        />
                        <small className="text-muted">
                            **At the moment I do not encrypt passwords so they will be sent as
                            plaintext.
                        </small>
                        <br></br>
                        <small className="text-muted">
                            **If you can run this locally, please do so.
                        </small>
                    </div>

                    {/* END PASSWORD INPUT */}

                    <ColorPicker setQrCode={setQrCode} />
                    <Size setQrCode={setQrCode} />

                    <input className="m-5" type="submit" value="Generate QR Code" />
                </form>
                {/* END FORM */}
            </div>
        </div>
    );
};

export default WiFi;
