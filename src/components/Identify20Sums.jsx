import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Container } from './ui/reused-ui/Container.jsx'
import './ui/reused-animations/fade.css'
import './Identify20Sums.css'

const Identify20Sums = () => {
    // State Management
    const [number, setNumber] = useState(20);
    const [sums, setSums] = useState([]);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [isProcessingCorrectAnswer, setIsProcessingCorrectAnswer] = useState(false);
    const [clickedExpression, setClickedExpression] = useState('');
    const [shakeButton, setShakeButton] = useState(null);
    const [buttonFadeState, setButtonFadeState] = useState('visible');

    // Variable Management
    const messages = [
        'Great Job!',
        'Awesome!',
        'Fantastic Job!',
        'That\'s correct!',
        'Great Work!',
        'That\'s right!',
        'You got it!'
    ]

    // Functions
    const generateNumberAndSums = () => {
        const newNumber = Math.floor(Math.random() * 15) + 6; // 7-20
        setNumber(newNumber);

        const newSums = [];
        
        // Create a pool of available numbers (1 to 15 to have enough options)
        const availableNumbers = [];
        for (let i = 1; i < newNumber; i++) {
            availableNumbers.push(i);
        }
        
        // Helper function to remove a number from available pool
        const removeNumber = (num) => {
            const index = availableNumbers.indexOf(num);
            if (index > -1) {
                availableNumbers.splice(index, 1);
            }
        };
        
        // Generate one equation that equals the target number
        const possiblePairs = [];
        for (let x = 1; x < newNumber; x++) {
            const y = newNumber - x;
            if (y >= 1 && y <= 15 && x !== y && availableNumbers.includes(x) && availableNumbers.includes(y)) {
                possiblePairs.push([x, y]);
            }
        }
        
        if (possiblePairs.length > 0) {
            const [x1, y1] = possiblePairs[Math.floor(Math.random() * possiblePairs.length)];
            newSums.push(`${x1} + ${y1}`);
            removeNumber(x1);
            removeNumber(y1);
        }
        
        // Generate 3 equations that don't equal the target number
        let attempts = 0;
        while (newSums.length < 4 && attempts < 100) {
            attempts++;
            
            let x, y;
            
            // If we have enough available numbers, use them exclusively
            if (availableNumbers.length >= 2) {
                x = availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
                const remainingNumbers = availableNumbers.filter(n => n !== x);
                y = remainingNumbers[Math.floor(Math.random() * remainingNumbers.length)];
                
                // Check if this sum equals the target (we don't want that)
                if (x + y !== newNumber) {
                    newSums.push(`${x} + ${y}`);
                    removeNumber(x);
                    removeNumber(y);
                }
            } else {
                // If we're running low on available numbers, allow reusing from the full range
                x = Math.floor(Math.random() * (newNumber - 1)) + 1;
                y = Math.floor(Math.random() * (newNumber - 1)) + 1;
                
                // Make sure x and y are different and the sum doesn't equal the target
                if (x !== y && x + y !== newNumber) {
                    newSums.push(`${x} + ${y}`);
                }
            }
        }
        
        // Final fallback: if we still don't have 4 expressions, create simple ones
        while (newSums.length < 4) {
            const x = Math.floor(Math.random() * (newNumber - 1)) + 1;
            const y = Math.floor(Math.random() * (newNumber - 1)) + 1;
            
            if (x !== y && x + y !== newNumber) {
                const expression = `${x} + ${y}`;
                // Avoid exact duplicates
                if (!newSums.includes(expression)) {
                    newSums.push(expression);
                }
            }
        }
        
        // Shuffle the array so the correct answer isn't always first
        for (let i = newSums.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newSums[i], newSums[j]] = [newSums[j], newSums[i]];
        }
        
        setSums(newSums);
        
        // Reset states when generating new questions
        setShowSuccessMessage(false);
        setIsProcessingCorrectAnswer(false);
        setClickedExpression('');
        setShakeButton(null);
        setButtonFadeState('visible');
    }

    useEffect(() => {
        generateNumberAndSums();
    }, []);

    const handleAnswerClick = (sum, index) => {
        // Prevent rapid clicking on correct answers
        if (isProcessingCorrectAnswer) {
            return;
        }

        // Parse the sum expression (e.g., "3 + 7" becomes 10)
        const [x, y] = sum.split(' + ').map(num => parseInt(num));
        const sumResult = x + y;
        
        if (sumResult === number) {
            // Mark as processing to prevent rapid clicks
            setIsProcessingCorrectAnswer(true);
            
            // Store the clicked expression
            setClickedExpression(sum);
            
            // Start fade-out animation
            setButtonFadeState('fade-out');
            
            // Trigger confetti after a short delay
            setTimeout(() => {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { x: 0.5, y: 0.5 }
                });
            }, 200);
            
            // Show success message after fade-out completes
            setTimeout(() => {
                setShowSuccessMessage(true);
            }, 200);
            
            // Wait 3 seconds then reset and generate new questions
            setTimeout(() => {
                setShowSuccessMessage(false);
                setIsProcessingCorrectAnswer(false);
                setClickedExpression('');
                generateNumberAndSums();
            }, 4000);
        } else {
            // Shake the wrong button
            setShakeButton(index);
            setTimeout(() => setShakeButton(null), 500);
        }
    }

	return (
        <Container
            text="Identify Sums"
            showResetButton={false}
            borderColor="#FF7B00"
            showSoundButton={true}
        >
            {/* Intro Text */}
            <div className='text-center text-sm text-gray-500 p-5 pb-3 flex-start'>
                Identify which of the numbers below add up to the number below!
            </div>

            {/* Number */}
            <div className='flex-grow flex justify-center items-center text-center text-5xl font-extrabold text-gray-800 p-5 flex-start'>
                {number}
            </div>

             <div className='relative bottom-[2%] w-[100%] h-[200px] grid grid-cols-2 gap-2 text-center text-sm text-gray-500 p-5 flex-start'>
                 {showSuccessMessage ? (
                     <div className='col-span-2 w-full flex flex-col justify-center items-center text-center text-green-600 p-5 pb-5'>
                        <div className='text-3xl'>
                            {clickedExpression} = {number}
                        </div>
                        <div className='text-xl mb-2'>
                            {messages[Math.floor(Math.random() * messages.length)]}
                        </div>
                     </div>
                 ) : (
                     <>
                         {sums.map((sum, index) => (
                             <button 
                             className={`w-full h-[80px] bg-blue-200 border border-blue-500 border-2 rounded-lg text-2xl font-extrabold text-blue-700 flex justify-center items-center ${
                                 shakeButton === index ? 'button-shake' : ''
                             } ${
                                 buttonFadeState === 'fade-out' ? 'fade-out-up-animation' : ''
                             }`} key={index}
                             onClick={() => handleAnswerClick(sum, index)}
                             >
                                 {sum}
                              </button>
                         ))}
                     </>
                 )}
             </div>
        </Container>
)
};


export default Identify20Sums;