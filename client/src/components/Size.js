import React from "react";

const Size = ({ setQrCode }) => {
    return (
        <div className="text-left mt-3">
            <label htmlFor="size" className="align-top">
                Size
            </label>
            <input
                type="number"
                name="size"
                id="number"
                min="1"
                max="14"
                className="form-control"
                onChange={(event) =>
                    setQrCode((newSize) => ({
                        ...newSize,
                        size: event.target.value,
                    }))
                }
            />
            <small className="text-muted">How large you want your QR code to be</small>
        </div>
    );
};

export default Size;
