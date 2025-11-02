import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Hero.scss';
import { useI18n } from '../../i18n/i18n';

// @ts-ignore
import photo1 from '../../assets/gallery/camphoto_684387517.JPG';
// @ts-ignore
import photo2 from '../../assets/gallery/camphoto_684387517 2.JPG';
import video1 from '../../assets/gallery/video.mp4';
import video2 from '../../assets/gallery/grok-video-6a023f7e-57aa-4326-ad84-234c8b43eaf2.mp4';
import video3 from '../../assets/gallery/grok-video-9bb52cd1-836a-451a-9c51-29e922ffe3d2 (1).mp4';

interface MediaFile {
    src: string;
    type: 'image' | 'video';
}

const Hero: React.FC = () => {
    const { t } = useI18n();

    const [selectedMedia, setSelectedMedia] = useState<MediaFile[]>([]);

    useEffect(() => {
        const allMedia: MediaFile[] = [
            { src: photo1, type: 'image' },
            { src: photo2, type: 'image' },
            { src: video1, type: 'video' },
            { src: video2, type: 'video' },
            { src: video3, type: 'video' },
        ];

        const shuffled = [...allMedia].sort(() => Math.random() - 0.5);
        setSelectedMedia(shuffled.slice(0, 5));
    }, []);
    return (
        <section id="hero" className="hero">
            <div className="hero-container">
                <motion.div
                    className="hero-content"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <motion.div
                        className="hero-badge"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        {t('hero.badge')}
                    </motion.div>

                    <motion.h1
                        className="hero-title"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        {t('hero.greeting', { name: 'Eiztrips' }).split('\n').map((s, i) => (
                            <span key={i} className={i === 0 ? 'gradient-text' : ''}>{s}</span>
                        ))}
                    </motion.h1>

                    <motion.p
                        className="hero-subtitle"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        {t('hero.subtitle')}
                    </motion.p>

                    <motion.p
                        className="hero-description"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.8 }}
                    >
                        {t('hero.description')}
                    </motion.p>

                    <motion.div
                        className="hero-buttons"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.8 }}
                    >
                        <motion.a
                            href="#projects"
                            className="btn btn-primary"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {t('hero.viewWork')}
                        </motion.a>
                        <motion.a
                            href="#contact"
                            className="btn btn-secondary"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {t('hero.getInTouch')}
                        </motion.a>
                    </motion.div>

                    <motion.div
                        className="hero-social"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1, duration: 0.8 }}
                    >
                        <motion.a
                            href="https://github.com/eiztrips"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                            whileHover={{ scale: 1.2, y: -3 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                        </motion.a>
                        <motion.a
                            href="https://leetcode.com/u/Eiztrips/s"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                            whileHover={{ scale: 1.2, y: -3 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img">
                                <rect x="3" y="3" width="18" height="18" rx="4" fill="currentColor" />
                                <path d="M8.5 9.5l5 3.5-5 3" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                <circle cx="17.5" cy="6.5" r="1.2" fill="#fff"/>
                            </svg>
                        </motion.a>
                        <motion.a
                            href="https://x.com/eiztrips"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                            aria-label="X"
                            whileHover={{ scale: 1.2, y: -3 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="X" focusable="false">
                                <title>X</title>
                                <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <line x1="20" y1="4" x2="4" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </motion.a>
                        <motion.a
                            href="https://habr.com/ru/users/eiztrips/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                            aria-label="Habr"
                            whileHover={{ scale: 1.2, y: -3 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Habr">
                                <title>Habr</title>
                                <rect x="2" y="2" width="20" height="20" rx="4" fill="currentColor"/>
                                <path d="M8 7v10h2V13h4v4h2V7h-2v4H10V7H8z" fill="#fff"/>
                            </svg>
                        </motion.a>
                    </motion.div>
                </motion.div>

                <motion.div
                    className="hero-visual"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                >
                    {selectedMedia.map((media, index) => (
                        <div key={index} className={`floating-card card-${index + 1}`}>
                            {media.type === 'image' ? (
                                <img
                                    src={media.src}
                                    alt={`Gallery ${index + 1}`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '12px'
                                    }}
                                />
                            ) : (
                                <video
                                    src={media.src}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '12px'
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </motion.div>
            </div>

            <div className="hero-scroll-indicator">
                <motion.div
                    className="scroll-arrow"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    ↓
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
