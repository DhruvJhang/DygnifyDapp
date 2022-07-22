import React from 'react';

const GradientButton = ({ children }) => {
    return (
        <button style={{ borderRadius: '100px', padding: '12px 24px', color: 'white' }} className="btn btn-wide bg-gradient-to-r from-[#4B74FF] to-[#9281FF] hover:from-[#9281FF] hover:to-[#4B74FF] capitalize font-medium border-none">{children}</button>
    );
};

export default GradientButton;