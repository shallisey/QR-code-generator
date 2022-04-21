import { React, useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const Get_QR_Code = () => {
    const { img } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    console.log(`Get_QR_Code: ${location.state}\n_IMG: ${img}`);

    // const downloadImg = "/get-image/" + location.state;

    const download = async (e) => {
        e.preventDefault();
        const res = {
            method: "GET",
            headers: {
                "Content-Type": "image/jpeg",
                "Content-Disposition": "attachment",
            },
        };
        const response = await fetch(`/get-image/${location.state}`, res);
        console.log(response);

        if (response.status === 404) {
            alert("File not found");

            navigate("/URL");
            return;
        }

        const blob = await response.blob();
        const newBlob = new Blob([blob]);

        const blobUrl = window.URL.createObjectURL(newBlob);

        console.log(blobUrl);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.setAttribute("download", `${img}`);
        // document.body.appendChild(link);
        link.click();
        // link.parentNode.removeChild(link);

        // // clean up Url
        // window.URL.revokeObjectURL(blobUrl);
    };

    return (
        <div>
            <h1>Download your image</h1>
            <button onClick={download}>Download</button>
        </div>
    );
};

export default Get_QR_Code;
