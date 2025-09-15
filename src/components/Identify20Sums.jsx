import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Container } from './ui/reused-ui/Container.jsx'
import './ui/reused-animations/fade.css'

const Identify20Sums = () => {


	return (
        <Container
            text="Identify Sums of 20"
            showResetButton={false}
            borderColor="#FF7B00"
            showSoundButton={true}
        >
            {/* Intro Text */}
            <div className='text-center text-sm text-gray-500 p-5 pb-3 flex-start'>
                Identify which of the numbers below add up to 20!
            </div>
        </Container>
)
};


export default Identify20Sums;