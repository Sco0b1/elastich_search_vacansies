'use client';

import React from 'react';
import styles from './SearchLayout.module.css';

interface SearchLayoutProps {
    filters: React.ReactNode;
    content: React.ReactNode;
}

export const SearchLayout: React.FC<SearchLayoutProps> = ({ filters, content }) => {
    return (
        <div className={styles.layoutContainer}>
            <aside className={styles.filtersColumn}>
                {filters}
            </aside>
            <main className={styles.contentColumn}>
                {content}
            </main>
        </div>
    );
};