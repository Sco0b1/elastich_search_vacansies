'use client';

import React from 'react';
import type { SearchBoxViewProps } from '@elastic/react-search-ui-views';
import styles from './CustomSearchBoxView.module.css';

export const CustomSearchBoxView: React.FC<SearchBoxViewProps> = ({
                                                                      inputProps,
                                                                      autocompleteSuggestions,
                                                                      autocompletedResults,
                                                                      onChange,
                                                                      onSubmit
                                                                  }) => {
    return (
        <div className={styles.searchContainer}>
            <h1 className={styles.headerText}>Search IT-Jobs</h1>
            <div className={styles.searchBox}>
                <input
                    {...inputProps}
                    className={styles.searchInput}
                    onChange={e => onChange(e.target.value)}
                    placeholder="Введіть посаду, майстерність або компанію..."
                />
                <button
                    onClick={() => onSubmit(inputProps.value)}
                    className={styles.searchButton}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className={styles.searchIcon} fill="none"
                         viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                </button>
            </div>
        </div>
    );
}