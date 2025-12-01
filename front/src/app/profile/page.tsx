'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import Header from '@/components/ui/Header/Header';
import EditProfileModal from '@/components/ui/EditProfileModal/EditProfileModal';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
    const router = useRouter();
    const { isAuthenticated, currentUser, loading, logout, login } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const handleSaveProfile = (updatedData: { name: string; email: string; password: string }) => {
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        const oldEmail = currentUser?.email;

        // Обновляем данные пользователя
        if (oldEmail && users[oldEmail]) {
            // Если email изменился, удаляем старый ключ и создаем новый
            if (oldEmail !== updatedData.email) {
                const userData = { ...users[oldEmail], ...updatedData };
                delete users[oldEmail];
                users[updatedData.email] = userData;
                localStorage.setItem('currentUser', updatedData.email);
            } else {
                users[oldEmail] = { ...users[oldEmail], ...updatedData };
            }
            localStorage.setItem('users', JSON.stringify(users));
            // Обновляем AuthContext
            login(updatedData.email, updatedData.name);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen p-8">
                <Header />
                <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                    <p className="text-gray-600">Завантаження...</p>
                </div>
            </main>
        );
    }

    if (!isAuthenticated || !currentUser) {
        return (
            <main className="min-h-screen p-8">
                <Header />
                <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                    <p className="text-gray-600">Ви не авторизовані. Будь ласка, увійдіть.</p>
                </div>
            </main>
        );
    }

    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[currentUser.email] || {};

    return (
        <main className="min-h-screen p-8">
            <Header />
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className={styles.purplebox}>
                    <h1 className={styles.headerText}>Особистий кабінет</h1>
                </div>
                <div className={styles.profileContainer}>
                    <div className={styles.profileCard}>
                        <h1 className="text-lg font-semibold text-gray-900 mb-4 justify-self-center">
                            Інформація про користувача
                        </h1>
                        <div className="space-y-3">
                            <p className="text-gray-600">
                                <span className="font-medium">Ім'я:</span> {user.name || 'Невідомо'}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-medium">Email:</span> {user.email || 'Невідомо'}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-medium">Дата реєстрації:</span>{' '}
                                {new Date(user.registrationDate).toLocaleDateString('uk-UA') || 'Невідомо'}
                            </p>
                        </div>
                        <div className={styles.buttonsContainer}>
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className={styles.editButton}
                            >
                                Редагувати профіль
                            </button>
                            <button
                                onClick={handleLogout}
                                className={styles.logoutButton}
                            >
                                Вийти
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {isEditModalOpen && (
                <EditProfileModal
                    user={user}
                    onSave={handleSaveProfile}
                    onClose={() => setIsEditModalOpen(false)}
                />
            )}
        </main>
    );
};

export default ProfilePage;