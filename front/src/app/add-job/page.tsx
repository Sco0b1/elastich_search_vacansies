// src/app/add-job/page.tsx

import AddJobForm from '@/components/AddJobForm/AddJobForm'; // Импортируем созданный компонент формы
import React from 'react'; // Импорт React

// Это стандартный компонент страницы Next.js
export default function AddJobPage() {
    return (
        // Здесь вы можете обернуть форму в ваш основной макет (layout.tsx), если он есть
        // Для примера просто рендерим компонент формы напрямую
        <AddJobForm />
    );
}