import { React, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import ColorPicker from "../components/ColorPicker";
import Size from "../components/Size";
import Password from "../components/Password";


const WiFi = () => {
    // Setup states
    const [qrCode, setQrCode] = useState({
        wifi: "true",
        ssid: null,
        authType: "nopass",
        password: null,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isAuthType, setIsAuthType] = useState(false);
    const navigate = useNavigate();

    const toggleAuth = (event) => {
        if (event.target.value === "nopass") {
            setIsAuthType(false);
            setQrCode((qrCode) => ({ ...qrCode, password: null }));
        } else {
            setIsAuthType(true);
            setQrCode((newAuthType) => ({
                ...newAuthType,
                authType: event.target.value,
            }));
        }
    };

    
    const updateToEncrypted = (encPass) => {
        setQrCode({...qrCode, password: encPass})
        // Setting within the scope of createRequest
        qrCode.password = encPass
    }

    const encryptPassword = async () => {

        const encryptRes = {
            method: "POST",
            headers: {
                "Content-Type": "text/plain",
            },
            body: qrCode.password
        }

        const encryptResponse = await fetch("http://localhost:8888/encrypt", encryptRes)
        // text() because the response is text/plain
        const encryptData = await encryptResponse.text()
        

        return encryptData
    
    }

    const createRequest = async (e) => {
        e.preventDefault();

        await encryptPassword(qrCode)
        // console.log("Before encryption", JSON.stringify(qrCode));

        /*
        THIS WHERE THE REQUEST TO OTHER MICROSERVICE WILL GO
        */
        const encryptedPassword = await encryptPassword(qrCode)

        updateToEncrypted(encryptedPassword)


        
        const res = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(qrCode),
            wifi: "true",
        };

        const response = await fetch("/create/WIFI-QR-Code", res);
        const data = await response.json();

        if (data.false) {
            alert(`Error: ${data.false}`);
        }

        // REDIRECT

        if (data.success) {
            navigate(`/get-QR-Code/${data.success}`, { state: data.success });
        }
    };

    // console.log(`Auth type: ${isAuthType}\nPassword: ${qrCode.password}`);

    // console.log(
    //     `SSID: ${qrCode.ssid}\nAuthentication Type: ${qrCode.authType}\nPassword: ${qrCode.password}\nFill_color: ${qrCode.fill_color}\nBack_color: ${qrCode.back_color}\nSize: ${qrCode.size}`
    // );


    return (
        <div className="container border-success">
            <div className="row border-success">
                <div className="col border-success">
                    <h1>Type: WiFi</h1>
                </div>
            </div>
            <div className="row border-success justify-content-center">
                {/* BEGIN FORM */}
                <form onSubmit={createRequest} className="col-6 form-group border">
                    {/* BEGIN SSID INPUT */}
                    <div className="text-left mt-5">
                        <label htmlFor="url" className="align-top">
                            SSID
                        </label>
                        <input
                            type="text"
                            name="ssid"
                            id="SSID"
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

                    {/* START AUTH TYPE */}

                    <div className="text-left mt-5">
                        <label htmlFor="url" className="align-top" defaultValue="nopass">
                            Authentication Type
                        </label>
                        <select type="select" className="form-control" onChange={toggleAuth}>
                            <option value="nopass">None</option>
                            <option value="WEP">WEP</option>
                            <option value="WPA">WPA</option>
                            <option value="WPA2">WPA2</option>
                        </select>
                    </div>

                    {/* END AUTH TYPE */}

                    {/* BEGIN PASSWORD INPUT */}
                    {/* <div className="text-left mt-3">
                        <label htmlFor="" className="align-top">
                            Password
                        </label>

                        <div className="input-group" id="show_hide_password">
                            <input
                                onChange={(event) =>
                                    setQrCode((newPassword) => ({
                                        ...newPassword,
                                        password: event.target.value,
                                    }))
                                }
                                className="form-control"
                                type={showPassword ? "text" : "password"}
                            />
                            <div className="input-group-addon">
                                <img
                                    src={showPassword ? openEye : closedEye}
                                    onClick={togglePasswordView}
                                    alt=""
                                />
                            </div>
                        </div>

                        <small className="text-muted">
                            **At the moment I do not encrypt passwords so they will be sent as
                            plaintext.
                        </small>
                        <br></br>
                        <small className="text-muted">
                            **If you can run this locally, please do so.
                        </small>
                    </div> */}

                    {isAuthType ? (
                        <Password
                            setQrCode={setQrCode}
                            setShowPassword={setShowPassword}
                            showPassword={showPassword}
                            isAuthType={isAuthType}
                        />
                    ) : (
                        <div hidden className=""></div>
                    )}

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
