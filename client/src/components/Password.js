import React from "react";
import closedEye from "../images/closed-eye.png";
import openEye from "../images/open-eye.png";

const Password = ({ setQrCode, setShowPassword, showPassword, isAuthType }) => {
    const togglePasswordView = () => {
        console.log(showPassword);
        setShowPassword(!showPassword);
    };

    return (
        <div className="text-left mt-3">
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
                *Password is encryped on form submission
            </small>

        </div>
    );
};

export default Password;
