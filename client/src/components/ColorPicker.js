import React from "react";

const ColorPicker = ({ setQrCode }) => {
    return (
        <React.Fragment>
            <div className="text-left mt-3">
                <label htmlFor="back_color" className="align-top">
                    Pick Dark Color
                </label>
                <input
                    type="color"
                    name="back_color"
                    id=""
                    defaultValue="#000000"
                    className="form-control"
                    onChange={(event) =>
                        setQrCode((newFillColor) => ({
                            ...newFillColor,
                            back_color: event.target.value,
                        }))
                    }
                />
                <small className="text-muted">This should be a relatively darker color</small>
            </div>

            <div className="text-left mt-3">
                <label htmlFor="fill_color" className="align-top">
                    Pick Lighter Color
                </label>
                <input
                    type="color"
                    name="fill_color"
                    id=""
                    defaultValue="#FFFFFF"
                    className="form-control"
                    onChange={(event) =>
                        setQrCode((newFillColor) => ({
                            ...newFillColor,
                            fill_color: event.target.value,
                        }))
                    }
                />
                <small className="text-muted">This should be a relatively lighter color</small>
            </div>
        </React.Fragment>
    );
};

export default ColorPicker;
