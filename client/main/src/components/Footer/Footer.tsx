import React from 'react';
import { motion } from 'framer-motion';
import './Footer.scss';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <motion.div
                    className="footer-content"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="footer-section">
                        <h3 className="footer-logo">Eiztrips</h3>
                        <p className="footer-description">
                            Backend Developer & Aspiring Entrepreneur
                        </p>
                    </div>

                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul className="footer-links">
                            <li><a href="#hero">Home</a></li>
                            <li><a href="#about">About</a></li>
                            <li><a href="#skills">Skills</a></li>
                            <li><a href="#projects">Projects</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Connect</h4>
                        <ul className="footer-links">
                            <li>
                                <a href="https://github.com/eiztrips" target="_blank" rel="noopener noreferrer">
                                    GitHub
                                </a>
                            </li>
                            <li>
                                <a href="https://linkedin.com/in/eiztrips" target="_blank" rel="noopener noreferrer">
                                    LinkedIn
                                </a>
                            </li>
                            <li>
                                <a href="mailto:contact@eiztrips.dev">
                                    Email
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Tech Stack</h4>
                        <div className="tech-icons">
                            <span title="Python">🐍</span>
                            <span title="Java">☕</span>
                            <span title="Docker">🐳</span>
                            <span title="PostgreSQL">🐘</span>
                            <span title="Linux">🐧</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="footer-bottom"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    <p>&copy; {currentYear} Eiztrips. All rights reserved.</p>
                    <p className="footer-credit">
                        Built with ❤️ using React, TypeScript & SCSS
                    </p>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;

