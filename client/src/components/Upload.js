import React from "react";

const Upload = ({ image, setImage }) => {
    const fileUpload = async (e) => {
        e.preventDefault();
        // Check if there is a file in the state
        if (image.file) {
            console.log(image.file.name);

            // Create new form data and add the file to the form data
            let fileData = new FormData();
            fileData.append("file", image.file);
            const res = {
                method: "POST",

                body: fileData,
            };

            const response = await fetch("/upload", res);

            const data = await response.json();
            console.log(data);
            if (data.error) {
                alert(data.error);
            } else {
                alert(data.Data);
            }
        } else {
            alert("No file selected");
        }
    };

    return (
        <div className="col border mt-5 mr-1">
            <h3>Upload QR Code</h3>
            <form action="" className="mt-3">
                <label htmlFor="url" className="align-top">
                    Select a file
                </label>
                <input
                    onChange={(event) => {
                        console.log(event.target.files[0]);
                        setImage((newImage) => ({
                            ...newImage,
                            file: event.target.files[0],
                        }));
                    }}
                    type="file"
                    accept="image/png"
                />
                <input onClick={fileUpload} type="submit" value="Upload QR Code" />
            </form>
        </div>
    );
};

export default Upload;
