import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const words = ["Innovate", "Collaborate", "Community", "Impact", "Inclusivity"];

interface Dimension {
  width: number;
  height: number;
}

const opacity = {
  initial: { opacity: 0 },
  enter: { opacity: 0.75, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const slideUp = {
  initial: { top: 0 },
  exit: { top: "-100vh", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 } }
};

const finalTextFadeIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1, transition: { duration: 1, ease: "easeOut" } },
};

const IntroAnimation: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [dimension, setDimension] = useState<Dimension>({ width: 0, height: 0 });
  const [showFinalText, setShowFinalText] = useState(false);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useEffect(() => {
    if (index < words.length) {
      const timeout = setTimeout(() => {
        setIndex(index + 1);
      }, index === 0 ? 800 : 700);
      return () => clearTimeout(timeout);
    } else if (index === words.length) {
      const timeout = setTimeout(() => {
        setShowFinalText(true);
        setTimeout(() => setIsAnimationComplete(true), 3000); // Start fading out after final text appears
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [index]);

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height} L0 0`;
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height} L0 0`;

  const curve = {
    initial: {
      d: initialPath,
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 }
    }
  };

  return (
    <AnimatePresence>
      {!isAnimationComplete && (
        <motion.div 
          variants={slideUp} 
          initial="initial" 
          exit="exit" 
          className="h-screen w-screen flex items-center justify-center fixed z-50 bg-[#141516]"
        >
          {dimension.width > 0 && (
            <>
              <AnimatePresence mode="wait">
                {!showFinalText && index < words.length && (
                  <motion.p 
                    key={words[index]}
                    variants={opacity} 
                    initial="initial" 
                    animate="enter"
                    exit="exit"
                    className="flex text-white text-4xl items-center absolute z-10"
                  >
                    <span className="block w-2.5 h-2.5 bg-white rounded-full mr-2.5"></span>
                    {words[index]}
                  </motion.p>
                )}
              </AnimatePresence>
              {showFinalText && (
                <motion.div
                  className="flex items-center justify-center text-white text-5xl font-bold absolute z-20"
                  variants={finalTextFadeIn}
                  initial="initial"
                  animate="animate"
                >
                  <img
                    src="https://res.cloudinary.com/dfyrk32ua/image/upload/v1727879247/gdgc/gdgc-logo_qkziza.png"
                    alt="GDSC Logo"
                    className="w-24 h-12 mr-4"
                  />
                  GDSC PCCoE
                </motion.div>
              )}
              <svg className="absolute top-0 w-full h-[calc(100%+300px)]">
                <motion.path 
                  variants={curve} 
                  initial="initial" 
                  exit="exit"
                  fill="#141516"
                ></motion.path>
              </svg>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;