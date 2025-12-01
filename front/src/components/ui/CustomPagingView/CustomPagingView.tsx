// src/components/ui/CustomPagingView/CustomPagingView.tsx

import React from 'react';
// Импортируем CSS Module
import styles from './Paging.module.css';


// Assuming CustomPagingViewProps is already defined correctly
interface CustomPagingViewProps {
    current: number;
    totalPages: number;
    onChange: (page: number) => void;
    resultsPerPage?: number;
}

// Вспомогательная функция для генерации диапазона номеров страниц для отображения
const getPaginationRange = (currentPage: number, totalPages: number, siblingCount: number = 1) => {
    const totalBlocks = siblingCount * 2 + 5;
    if (totalBlocks >= totalPages) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 2);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages - 1);
    const showLeftEllipsis = leftSiblingIndex > 2;
    const showRightEllipsis = rightSiblingIndex < totalPages - 1;
    if (!showLeftEllipsis && showRightEllipsis) {
        const leftRange = Array.from({ length: rightSiblingIndex }, (_, i) => i + 1);
        return [...leftRange, '...', totalPages];
    }
    if (showLeftEllipsis && !showRightEllipsis) {
        const rightRange = Array.from({ length: totalPages - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i);
        return [1, '...', ...rightRange];
    }
    if (showLeftEllipsis && showRightEllipsis) {
        const middleRange = Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i);
        return [1, '...', ...middleRange, '...', totalPages];
    }
    return Array.from({ length: totalPages }, (_, i) => i + 1);
};


export const CustomPagingView: React.FC<CustomPagingViewProps> = ({
                                                                      current,
                                                                      totalPages,
                                                                      onChange,
                                                                      resultsPerPage
                                                                  }) => {
    const pagesToRender = getPaginationRange(current, totalPages, 1);

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className={styles.paginationContainer} >
            <button
                onClick={() => onChange(current - 1)}
                disabled={current === 1}
                className={`${styles.paginationButton} ${current === 1 ? styles.paginationButtonDisabled : ''}`}
                aria-label="Предыдущая страница"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.icon} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            </button>

            {pagesToRender.map((page: number | string, index: number) => {
                if (page === '...') {
                    return (
                        <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                            ...
                        </span>
                    );
                }

                const pageNum = Number(page);
                return (
                    <button
                        key={pageNum}
                        onClick={() => onChange(pageNum)}
                        className={`${styles.paginationButton} ${current === pageNum ? styles.active : ''}`}
                        disabled={current === pageNum}
                        aria-current={current === pageNum ? 'page' : undefined}
                    >
                        {pageNum}
                    </button>
                );
            })}

            <button
                onClick={() => onChange(current + 1)}
                disabled={current === totalPages}
                className={`${styles.paginationButton} ${current === totalPages ? styles.paginationButtonDisabled : ''}`}
                aria-label="Следующая страница"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className={styles.icon} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
    );
};