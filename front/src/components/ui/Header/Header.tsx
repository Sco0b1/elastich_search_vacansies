'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import LoginModal from '@/components/ui/LoginModal/LoginModal';
import styles from './Header.module.css';

const Header: React.FC = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const { isAuthenticated, currentUser, loading, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    if (loading) {
        return (
            <header className={styles.header}>
                <Link href="/" className={styles.logo}>
                    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>ITвакансія</span>
                </Link>
            </header>
        );
    }

    return (
        <header className={styles.header}>
            <Link href="/" className={styles.logo}>
                <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>ITвакансія</span>
            </Link>
            {isAuthenticated && currentUser ? (
                <div className={styles.authenticatedContainer}>
                    <Link href="/profile" className={styles.accountButton}>
                        <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="white">
                            <circle cx="12" cy="8" r="4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 12c-2.67 0-8 1.33-8 4v2h16v-2c0-2.67-5.33-4-8-4z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {currentUser.name || currentUser.email}
                    </Link>
                    <button
                        onClick={handleLogout}
                        className={styles.logoutButton}
                    >
                        Вийти
                    </button>
                </div>
            ) : (
                <button
                    className={styles.profileButton}
                    onClick={() => setIsLoginOpen(true)}
                >
                    <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="#ffffff">
                        <circle cx="12" cy="8" r="4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 12c-2.67 0-8 1.33-8 4v2h16v-2c0-2.67-5.33-4-8-4z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Особистий кабінет
                </button>
            )}
            {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}
        </header>
    );
};

export default Header;