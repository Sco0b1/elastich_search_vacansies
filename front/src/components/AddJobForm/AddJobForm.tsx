'use client';

import React, { useState, FormEvent } from 'react';
import styles from './AddJobForm.module.css';

interface JobPosting {
    title: string;
    description: string;
    company: string;
    location: string;
    salary?: number | string;
    employment_type?: string;
    remote_type?: string;
    experience_level?: string;
    skills?: string;
}

const AddJobForm: React.FC = () => {
    const [formData, setFormData] = useState<JobPosting>({
        title: '',
        description: '',
        company: '',
        location: '',
        salary: '',
        employment_type: '',
        remote_type: '',
        experience_level: '',
        skills: '',
    });

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSkillsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFormData({
            ...formData,
            skills: value,
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');
        setMessage(null);

        if (!formData.title || !formData.description || !formData.company || !formData.location) {
            setStatus('error');
            setMessage('Пожалуйста, заполните все обязательные поля.');
            return;
        }

        try {
            const response = await fetch('/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus('success');
                setMessage('Вакансия успешно добавлена!');
                setFormData({
                    title: '', description: '', company: '', location: '', salary: '',
                    employment_type: '', remote_type: '', experience_level: '', skills: ''
                });
            } else {
                const errorData = await response.json();
                setStatus('error');
                setMessage(errorData.message || 'Не удалось добавить вакансию. Попробуйте позже.');
            }
        } catch (error: any) {
            console.error('Ошибка при отправке формы:', error);
            setStatus('error');
            setMessage('Произошла ошибка при добавлении вакансии: ' + error.message);
        }
    };

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className={styles.container}>
                    <h2 className={styles.title}>Додати нову вакансію</h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="title" className={styles.label}>Назва вакансії</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="description" className={styles.label}>Опис</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                rows={4}
                                className={styles.textarea}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="company" className={styles.label}>Компанія</label>
                            <input
                                type="text"
                                id="company"
                                name="company"
                                value={formData.company}
                                onChange={handleInputChange}
                                required
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                                <label htmlFor="location" className={styles.label}>Локація</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                required
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="salary" className={styles.label}>Зарплата (Опціонально)</label>
                            <input
                                type="text"
                                id="salary"
                                name="salary"
                                value={formData.salary}
                                onChange={handleInputChange}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="employment_type" className={styles.label}>Тип зайнятості (опціонально)</label>
                            <input
                                type="text"
                                id="employment_type"
                                name="employment_type"
                                value={formData.employment_type}
                                onChange={handleInputChange}
                                className={styles.input}
                            />
                        </div>


                        <div className={styles.formGroup}>
                            <label htmlFor="experience_level" className={styles.label}>Рівень досвіду (опціонально)</label>
                            <input
                                type="text"
                                id="experience_level"
                                name="experience_level"
                                value={formData.experience_level}
                                onChange={handleInputChange}
                                className={styles.input}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="skills" className={styles.label}>Навички (опціонально, через кому)</label>
                            <input
                                type="text"
                                id="skills"
                                name="skills"
                                value={formData.skills}
                                onChange={handleSkillsInputChange}
                                placeholder="Наприклад: React, Node.js, TypeScript"
                                className={styles.input}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className={styles.submitButton}
                        >
                            {status === 'loading' ? 'Додаемо...' : 'Додати вакансію'}
                        </button>

                        {message && (
                            <div className={`${styles.statusMessage} ${status === 'success' ? styles.success : styles.error}`}>
                                {message}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddJobForm;