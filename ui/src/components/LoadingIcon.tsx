import React from 'react';

const pulseStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    background: 'transparent',
};

const svgStyle: React.CSSProperties = {
    width: '100px',
    height: '100px',
    animation: 'pulse 1.5s infinite',
};

const styleSheet = `
@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.15); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
}
`;

export function LoadingIcon() {
    return (
        <div style={pulseStyle}>
            <style>{styleSheet}</style>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 100"
                style={svgStyle}
            >
                <text
                    y=".9em"
                    fontSize="110"
                    fill="lightgray"
                    textAnchor="middle"
                    x="50"
                >
                    L I
                </text>
            </svg>
        </div>
    );
}
