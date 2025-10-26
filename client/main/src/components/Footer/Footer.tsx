import React from 'react';
import { motion } from 'framer-motion';
import './Footer.scss';
import { useI18n } from '../../i18n/i18n';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const { t } = useI18n();

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
                        <h3 className="footer-logo">{t('navbar.logo')}</h3>
                        <p className="footer-description">
                            {t('footer.description')}
                        </p>
                    </div>

                    <div className="footer-section">
                        <h4>{t('footer.quickLinks.home') /* quick label */ ? t('footer.quickLinks.home') : 'Quick Links'}</h4>
                        <ul className="footer-links">
                            <li><a href="#hero">{t('footer.quickLinks.home')}</a></li>
                            <li><a href="#about">{t('footer.quickLinks.about')}</a></li>
                            <li><a href="#skills">{t('footer.quickLinks.skills')}</a></li>
                            <li><a href="#projects">{t('footer.quickLinks.projects')}</a></li>
                            <li><a href="#contact">{t('footer.quickLinks.contact')}</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>{t('footer.connect.github')}</h4>
                        <ul className="footer-links">
                            <li>
                                <a href="https://github.com/eiztrips" target="_blank" rel="noopener noreferrer">
                                    {t('footer.connect.github')}
                                </a>
                            </li>
                            <li>
                                <a href="https://linkedin.com/in/eiztrips" target="_blank" rel="noopener noreferrer">
                                    {t('footer.connect.linkedin')}
                                </a>
                            </li>
                            <li>
                                <a href="mailto:contact@eiztrips.dev">
                                    {t('footer.connect.email')}
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>{t('footer.techStack')}</h4>
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
                    <p>{t('footer.copyright').replace('{year}', String(currentYear))}</p>
                    <p className="footer-credit">
                        {t('footer.builtWith')}
                    </p>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;
