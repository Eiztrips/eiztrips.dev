import React from 'react';
import { motion } from 'framer-motion';
import './Skills.scss';
import { useI18n } from '../../i18n/i18n';

interface Skill {
    name: string;
    category: string;
}

const Skills: React.FC = () => {
    const { t } = useI18n();

    const skills: Skill[] = [
        { name: 'CORE', category: 'Python' },
        { name: 'FastAPI', category: 'Python' },
        { name: 'SQLAlchemy', category: 'Python' },
        { name: 'Pytest', category: 'Python' },
        { name: 'aioKafka', category: 'Python' },

        { name: 'CORE', category: 'Java' },
        { name: 'Spring Boot', category: 'Java' },
        { name: 'Hibernate', category: 'Java' },
        { name: 'JUnit', category: 'Java' },
        { name: 'Gradle', category: 'Java' },
        { name: 'Redis', category: 'Java' },
        { name: 'Kafka', category: 'Java' },

        { name: 'Docker', category: 'DevOps' },
        { name: 'Linux', category: 'DevOps' },
        { name: 'Git', category: 'DevOps' },

        { name: 'MySQL', category: 'Database' },
        { name: 'PostgreSQL', category: 'Database' },
        { name: 'MongoDB', category: 'Database' },

        { name: 'Windows', category: 'OS' },
        { name: 'MacOS', category: 'OS' },
        { name: 'Arch_linux', category: 'OS' },
        { name: 'Kali_linux', category: 'OS' },
        { name: 'Ubuntu', category: 'OS' },
        { name: "Debian", category: 'OS' },

    ];

    const categories = ['Python', 'Java', 'DevOps', 'Database', 'OS'];

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
                                .map((skill) => (
                                    <motion.div
                                        key={skill.name}
                                        className="skill-card"
                                        variants={itemVariants}
                                        whileHover={{ y: -10, scale: 1.05 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                    >
                                        <h4 className="skill-name">{skill.name}</h4>
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
