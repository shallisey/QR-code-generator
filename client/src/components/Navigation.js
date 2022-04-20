import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Navbar, Nav } from "react-bootstrap";

function Navigation() {
    return (
        <Navbar className="navvy" expand="lg" variant="dark">
            <Nav>
                <LinkContainer to="/">
                    <Nav.Link>Home</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/URL">
                    <Nav.Link>URL</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/WiFi">
                    <Nav.Link>WiFi</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/Read_QR_Code">
                    <Nav.Link>Read QR Code</Nav.Link>
                </LinkContainer>
            </Nav>
        </Navbar>
    );
}

export default Navigation;
