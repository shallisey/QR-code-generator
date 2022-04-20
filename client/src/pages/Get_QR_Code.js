import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const Get_QR_Code = () => {
    const { state } = useParams();
    const location = useLocation();
    console.log("Get_QR_Code", location.state);
    return <div>hi </div>;
};

export default Get_QR_Code;
