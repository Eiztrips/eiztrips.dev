import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Contact.scss';
import { useI18n } from '../../i18n/i18n';
import { checkAuthToken, getVKAuthUrl, getTelegramAuthUrl } from '../../utils/auth';

const Contact: React.FC = () => {
    const { t } = useI18n();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const verifyAuth = async () => {
            const isValid = await checkAuthToken();
            setIsAuthenticated(isValid);
        };

        verifyAuth();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Simulate form submission
        try {
            // Here you would normally send the form data to your backend
            console.log('Form submitted:', formData);
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });

            setTimeout(() => setStatus('idle'), 5000);
        } catch (error) {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleVKLogin = () => {
        window.location.href = getVKAuthUrl();
    };

    const handleTelegramLogin = () => {
        window.location.href = getTelegramAuthUrl();
    };

    return (
        <section id="contact" className="contact section">
            <div className="container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="section-title">{t('contact.title')}</h2>
                    <p className="section-description">
                        {t('contact.description')}
                    </p>
                </motion.div>

                <div className="contact-content">
                    <motion.div
                        className="contact-info"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="info-card">
                            <div className="info-icon">📧</div>
                            <h3>{t('contact.email')}</h3>
                            <a href="mailto:eiztrips.dev@yandex.ru">eiztrips.dev@yandex.ru</a>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">👤</div>
                            <h3>{t('contact.telegram')}</h3>
                            <a href="https://t.me/contact_eiztrips" target="_blank" rel="noopener noreferrer">
                                @contact_eiztrips
                            </a>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">💬</div>
                            <h3>{t('contact.discord')}</h3>
                            <a href="https://discord.gg/WWfshaCBj7" target="_blank" rel="noopener noreferrer">
                                @eiztrips
                            </a>
                        </div>
                    </motion.div>

                    {isAuthenticated === null ? (
                        <motion.div
                            className="contact-form loading"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <p>Загрузка...</p>
                        </motion.div>
                    ) : isAuthenticated ? (
                        <motion.form
                            className="contact-form"
                            onSubmit={handleSubmit}
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="form-group">
                                <label htmlFor="name">{t('contact.form.name')}</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder={t('contact.form.namePlaceholder')}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">{t('contact.form.email')}</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder={t('contact.form.emailPlaceholder')}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">{t('contact.form.message')}</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    placeholder={t('contact.form.messagePlaceholder')}
                                />
                            </div>

                            <motion.button
                                type="submit"
                                className="btn btn-primary"
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {t('contact.form.send')}
                            </motion.button>

                            {status === 'success' && (
                                <motion.div
                                    className="form-message success"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    {t('contact.form.success')}
                                </motion.div>
                            )}

                            {status === 'error' && (
                                <motion.div
                                    className="form-message error"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    {t('contact.form.error')}
                                </motion.div>
                            )}
                        </motion.form>
                    ) : (
                        <motion.div
                            className="auth-required"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="auth-message">
                                <h3>Войдите, чтобы отправить сообщение</h3>
                                <p>Выберите удобный способ авторизации</p>
                            </div>

                            <div className="auth-buttons">
                                <motion.button
                                    type="button"
                                    className="btn btn-vk"
                                    onClick={handleVKLogin}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span className="btn-icon">🔵</span>
                                    Войти через ВКонтакте
                                </motion.button>

                                <motion.button
                                    type="button"
                                    className="btn btn-telegram"
                                    onClick={handleTelegramLogin}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span className="btn-icon">✈️</span>
                                    Войти через Telegram
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Contact;
