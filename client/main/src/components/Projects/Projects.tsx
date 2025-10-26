import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Projects.scss';

interface Repository {
    id: number;
    name: string;
    description: string;
    html_url: string;
    language: string;
    stargazers_count: number;
    forks_count: number;
    topics: string[];
}

const Projects: React.FC = () => {
    const [repos, setRepos] = useState<Repository[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');

    useEffect(() => {
        fetchGitHubRepos();
    }, []);

    const fetchGitHubRepos = async () => {
        try {
            const response = await fetch('https://api.github.com/users/eiztrips/repos?sort=updated&per_page=100');
            const data = await response.json();
            setRepos(data.filter((repo: Repository) => !repo.name.includes('eiztrips') || repo.description));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching repos:', error);
            setLoading(false);
        }
    };

    const languages = ['all', ...Array.from(new Set(repos.map(repo => repo.language).filter(Boolean)))];

    const filteredRepos = filter === 'all'
        ? repos
        : repos.filter(repo => repo.language === filter);

    const getLanguageColor = (language: string): string => {
        const colors: { [key: string]: string } = {
            Python: '#3776ab',
            JavaScript: '#f7df1e',
            TypeScript: '#3178c6',
            Java: '#007396',
            Go: '#00add8',
            Rust: '#dea584',
            Shell: '#89e051',
        };
        return colors[language] || '#888';
    };

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
        <section id="projects" className="projects section">
            <div className="container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="section-title">Projects</h2>
                    <p className="section-description">
                        Explore my latest work and open-source contributions
                    </p>
                </motion.div>

                <motion.div
                    className="filter-buttons"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    {languages.map(lang => (
                        <motion.button
                            key={lang}
                            className={`filter-btn ${filter === lang ? 'active' : ''}`}
                            onClick={() => setFilter(lang)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {lang}
                        </motion.button>
                    ))}
                </motion.div>

                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                        <p>Loading projects...</p>
                    </div>
                ) : (
                    <motion.div
                        className="projects-grid"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {filteredRepos.slice(0, 9).map((repo) => (
                            <motion.a
                                key={repo.id}
                                href={repo.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="project-card"
                                variants={itemVariants}
                                whileHover={{ y: -10, scale: 1.02 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                <div className="project-header">
                                    <div className="project-icon">📁</div>
                                    <div className="project-links">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                        </svg>
                                    </div>
                                </div>

                                <h3 className="project-title">{repo.name}</h3>
                                <p className="project-description">
                                    {repo.description || 'No description provided'}
                                </p>

                                <div className="project-footer">
                                    {repo.language && (
                                        <div className="project-language">
                      <span
                          className="language-dot"
                          style={{ backgroundColor: getLanguageColor(repo.language) }}
                      />
                                            {repo.language}
                                        </div>
                                    )}
                                    <div className="project-stats">
                                        <span>⭐ {repo.stargazers_count}</span>
                                        <span>🔀 {repo.forks_count}</span>
                                    </div>
                                </div>

                                {repo.topics && repo.topics.length > 0 && (
                                    <div className="project-topics">
                                        {repo.topics.slice(0, 3).map(topic => (
                                            <span key={topic} className="topic-tag">
                        {topic}
                      </span>
                                        ))}
                                    </div>
                                )}
                            </motion.a>
                        ))}
                    </motion.div>
                )}

                <motion.div
                    className="view-more"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <motion.a
                        href="https://github.com/eiztrips?tab=repositories"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        View All Projects on GitHub
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
};

export default Projects;

