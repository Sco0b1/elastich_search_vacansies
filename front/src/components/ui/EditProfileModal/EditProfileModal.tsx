'use client';

import React, { useState } from 'react';
import styles from './EditProfileModal.module.css';

interface EditProfileModalProps {
    user: { name: string; email: string; password: string };
    onSave: (updatedData: { name: string; email: string; password: string }) => void;
    onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onSave, onClose }) => {
    const [name, setName] = useState(user.name || '');
    const [email, setEmail] = useState(user.email || '');
    const [password, setPassword] = useState(user.password || '');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password) {
            alert('Будь ласка, заповніть усі поля');
            return;
        }

        // Проверка, существует ли пользователь с новым email
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        if (email !== user.email && users[email]) {
            alert('Користувач із таким email уже існує');
            return;
        }

        onSave({ name, email, password });
        onClose();
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>
                    ×
                </button>
                <h2 className={styles.modalTitle}>Редагувати профіль</h2>
                <form onSubmit={handleSubmit} className={styles.editForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Ім'я</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Введіть ім'я"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@mail.com"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="password">Пароль</label>
                        <div className={styles.passwordWrapper}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Введіть пароль"
                                required
                            />
                            <button
                                type="button"
                                className={styles.togglePassword}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                👁️
                            </button>
                        </div>
                    </div>
                    <button type="submit" className={styles.submitButton}>
                        Зберегти
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;