import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import '../css/Header.css'; // Optional, for custom styles

// Import Google Font link in your HTML or CSS
// Add the following line in your HTML `<head>` tag:
// <link href="https://fonts.googleapis.com/css2?family=Anton&display=swap" rel="stylesheet">

const Header: React.FC = () => {
    // React Spring animation for the header
    const props = useSpring({
        opacity: 1,
        transform: "translateY(0px)",
        from: { opacity: 0, transform: "translateY(-100px)" },
        config: { tension: 170, friction: 26 }
    });

    return (
        <div className="header-container">
            <animated.h1 style={props} className="header-text">
                Wordle
            </animated.h1>
        </div>
    );
};

export default Header;
