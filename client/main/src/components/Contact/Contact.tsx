import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Contact.scss';
import { useI18n } from '../../i18n/i18n';

const Contact: React.FC = () => {
    const { t } = useI18n();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

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
                            <div className="info-icon">💼</div>
                            <h3>{t('contact.linkedin')}</h3>
                            <a href="https://linkedin.com/in/eiztrips" target="_blank" rel="noopener noreferrer">
                                linkedin.com/in/eiztrips
                            </a>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">🐙</div>
                            <h3>{t('contact.github')}</h3>
                            <a href="https://github.com/eiztrips" target="_blank" rel="noopener noreferrer">
                                eiztrips
                            </a>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">📍</div>
                            <h3>{t('contact.location')}</h3>
                            <p>{t('contact.location')}</p>
                        </div>
                    </motion.div>

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
                </div>
            </div>
        </section>
    );
};

export default Contact;
