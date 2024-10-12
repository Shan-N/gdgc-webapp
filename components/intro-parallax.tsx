"use client";

import styles from './styles.module.scss';
import Image from 'next/image';
import { useScroll, useTransform, motion} from 'framer-motion';
import { useRef } from 'react';
import { useEffect } from 'react';
import Lenis from 'lenis'

export default function IntroParallax() {
    
    useEffect( () => {
        const lenis = new Lenis()
      
        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }
  
        requestAnimationFrame(raf)
    },[])
  

    const container = useRef(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start start', 'end end']
    })

    const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
    const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
    const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
    const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
    const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

    const pictures = [
        {
            src: "https://res.cloudinary.com/dfyrk32ua/image/upload/v1727879247/gdgc/gdgc-logo_qkziza.png",
            scale: scale4
        },
        {
            src: "https://res.cloudinary.com/dfyrk32ua/image/upload/v1727879247/gdgc/gdgc-logo_qkziza.png",
            scale: scale5
        },
        {
            src: "https://res.cloudinary.com/dfyrk32ua/image/upload/v1727879247/gdgc/gdgc-logo_qkziza.png",
            scale: scale6
        },
        {
            src: "https://res.cloudinary.com/dfyrk32ua/image/upload/v1727879247/gdgc/gdgc-logo_qkziza.png",
            scale: scale5
        },
        {
            src: "https://res.cloudinary.com/dfyrk32ua/image/upload/v1727879247/gdgc/gdgc-logo_qkziza.png",
            scale: scale6
        },
        {
            src: "https://res.cloudinary.com/dfyrk32ua/image/upload/v1727879247/gdgc/gdgc-logo_qkziza.png",
            scale: scale8
        },
        {
            src: "https://res.cloudinary.com/dfyrk32ua/image/upload/v1727879247/gdgc/gdgc-logo_qkziza.png",
            scale: scale9
        }
    ]

    return (
        <div ref={container} className={styles.container}>
            <div className={styles.sticky}>
                {
                    pictures.map( ({src, scale}, index) => {
                        return <motion.div key={index} style={{scale}} className={styles.el}>
                            <div className={styles.imageContainer}>
                                <Image
                                    src={src}
                                    fill
                                    alt="image"
                                  
                                />
                            </div>
                        </motion.div>
                    })
                }
            </div>
        </div>
    )
}