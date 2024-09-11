import {useEffect} from "react";
import {AvatarComponent} from "./AvatarComponent/AvatarComponent.jsx";
import {Container} from "react-bootstrap";

export const AboutPage = () => {

    return (
        <Container className="d-flex flex-row">
            <AvatarComponent userId="8ul6x5vrbOgNZFAiKDsabngaDLH2"/>
            <AvatarComponent userId="ywzCiDxiaGg2CiFB0aqYSkhAGdl2"/>
            <AvatarComponent userId="s6Nd32CDWiSP9lPbyfipS2Vzj7s1"/>
        </Container>
    )

}
