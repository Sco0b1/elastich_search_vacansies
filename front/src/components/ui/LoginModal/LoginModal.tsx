'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import styles from './LoginModal.module.css';

const LoginModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem('users') || '{}');

        if (isLoginMode) {
            if (users[email] && users[email].password === password) {
                login(email, users[email].name);
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('currentUser', email);
                onClose();

            } else {
                alert('Невірний email або пароль');
            }
        } else {
            if (!email || !password || !name) {
                alert('Будь ласка, заповніть усі поля');
                return;
            }
            if (users[email]) {
                alert('Користувач із таким email уже зареєстрований');
                return;
            }
            users[email] = {
                email,
                password,
                name,
                registrationDate: new Date().toISOString(),
            };
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('currentUser', email);
            login(email, name);
            onClose();
            router.push('/profile');
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>
                    ×
                </button>
                <h2 className={styles.modalTitle}>
                    {isLoginMode ? 'Вхід в Особистий кабінет' : 'Реєстрація'}
                </h2>
                <p className={styles.modalSubtitle}>
                    {isLoginMode
                        ? 'Увійдіть, щоб отримати доступ до своїх вакансій та відповідей'
                        : 'Створіть аккаунт, щоб почати'}
                </p>
                <form onSubmit={handleSubmit} className={styles.loginForm}>
                    {!isLoginMode && (
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
                    )}
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@mail.ru"
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
                                placeholder="Введите пароль"
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
                    <div className={styles.checkboxGroup}>
                        <input type="checkbox" id="remember" />
                        <label htmlFor="remember">Запам'ятати мене</label>
                    </div>
                    <button type="submit" className={styles.submitButton}>
                        {isLoginMode ? 'Увійти' : 'Зареєструватися'}
                    </button>
                </form>
                <div className={styles.registerLink}>
                    {isLoginMode ? 'Ще немає аккаунта? ' : 'Вже є аккаунт? '}
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setIsLoginMode(!isLoginMode);
                        }}
                    >
                        {isLoginMode ? 'Зареєструватися' : 'Увійти'}
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;