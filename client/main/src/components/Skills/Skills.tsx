import React from 'react';
import { motion } from 'framer-motion';
import './Skills.scss';
import { useI18n } from '../../i18n/i18n';

interface Skill {
    name: string;
    icon: string;
    level: number;
    category: string;
}

const Skills: React.FC = () => {
    const { t } = useI18n();

    const skills: Skill[] = [
        { name: 'Python', icon: '🐍', level: 90, category: 'Backend' },
        { name: 'FastAPI', icon: '⚡', level: 85, category: 'Backend' },
        { name: 'SQLAlchemy', icon: '🗄️', level: 80, category: 'Backend' },
        { name: 'Pytest', icon: '✅', level: 85, category: 'Backend' },
        { name: 'aioKafka', icon: '📨', level: 75, category: 'Backend' },
        { name: 'Java', icon: '☕', level: 80, category: 'Backend' },
        { name: 'Spring Boot', icon: '🍃', level: 75, category: 'Backend' },
        { name: 'Hibernate', icon: '💾', level: 70, category: 'Backend' },
        { name: 'Docker', icon: '🐳', level: 85, category: 'DevOps' },
        { name: 'PostgreSQL', icon: '🐘', level: 85, category: 'Database' },
        { name: 'Linux', icon: '🐧', level: 80, category: 'DevOps' },
        { name: 'Git', icon: '📦', level: 85, category: 'Tools' },
    ];

    const categories = Array.from(new Set(skills.map(skill => skill.category)));

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    };

    return (
        <section id="skills" className="skills section">
            <div className="container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="section-title">{t('skills.title')}</h2>
                    <p className="section-description">
                        {t('skills.description')}
                    </p>
                </motion.div>

                {categories.map((category, catIndex) => (
                    <div key={category} className="skills-category">
                        <motion.h3
                            className="category-title"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: catIndex * 0.1 }}
                        >
                            {category}
                        </motion.h3>

                        <motion.div
                            className="skills-grid"
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            {skills
                                .filter(skill => skill.category === category)
                                .map((skill, index) => (
                                    <motion.div
                                        key={skill.name}
                                        className="skill-card"
                                        variants={itemVariants}
                                        whileHover={{ y: -10, scale: 1.05 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                    >
                                        <div className="skill-icon">{skill.icon}</div>
                                        <h4 className="skill-name">{skill.name}</h4>
                                        <div className="skill-bar">
                                            <motion.div
                                                className="skill-progress"
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${skill.level}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1, delay: index * 0.1 }}
                                            />
                                        </div>
                                        <span className="skill-level">{skill.level}%</span>
                                    </motion.div>
                                ))}
                        </motion.div>
                    </div>
                ))}

                <motion.div
                    className="additional-info"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="info-card">
                        <h4>{t('skills.additional.info1.title')}</h4>
                        <p>{t('skills.additional.info1.text')}</p>
                    </div>
                    <div className="info-card">
                        <h4>{t('skills.additional.info2.title')}</h4>
                        <p>{t('skills.additional.info2.text')}</p>
                    </div>
                    <div className="info-card">
                        <h4>{t('skills.additional.info3.title')}</h4>
                        <p>{t('skills.additional.info3.text')}</p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Skills;
