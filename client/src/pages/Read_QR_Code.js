import React, { useRef, useState } from "react";
import Upload from "../components/Upload";

const Read_QR_Code = () => {
    const [useWebcam, setUseWebcam] = useState(false);
    const webcamElement = useRef(null);

    const [image, setImage] = useState({ file: null });

    const startWebcam = () => {
        setUseWebcam(true);

        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
            let webcam = webcamElement.current;
            webcam.srcObject = stream;
            webcam.play();
        });
    };

    const stopWebcam = () => {
        setUseWebcam(false);
        // Grab the srcObject of the video element in useRef (webcamElement)
        const webcam = webcamElement.current;

        // This will give us all of the video streams from the webcam.
        const getAllStreams = webcam.srcObject.getTracks();

        // Go through all of the video streams and stop them
        getAllStreams.forEach(function (track) {
            track.stop();
        });
    };

    // if (image.file) {
    //     console.log(image.file.name);
    // }

    return (
        <div className="container border-success">
            <div className="row border-success">
                <div className="col border-success">
                    <h1>Type: Read QR Code</h1>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    {/* START UPLOAD FILE */}

                    <Upload image={image} setImage={setImage} />
                    {/* END UPLOAD FILE */}

                    {/* START WEBCAM SCAN */}
                    {/* <div className="col border mt-5 ml-1">
                        <h3>Scan via webcam</h3>
                        <div id="video-container">
                            <video ref={webcamElement} id="webcam-element"></video>
                        </div>
                        {useWebcam ? (
                            <button className="m-3" onClick={stopWebcam}>
                                Stop
                            </button>
                        ) : (
                            <button className="m-3" onClick={startWebcam}>
                                Start
                            </button>
                        )}
                    </div> */}
                    {/* END WEBCAM SCAN */}
                </div>
            </div>
        </div>
    );
};

export default Read_QR_Code;
