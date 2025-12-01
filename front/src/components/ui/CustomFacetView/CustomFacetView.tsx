import React, { useState, useEffect, useRef } from 'react';
import { FacetViewProps } from '@elastic/react-search-ui-views';
import styles from './Facet.module.css';

export const CustomFacetView: React.FC<FacetViewProps> = ({
                                                              label,
                                                              options = [],
                                                              searchTerm = '',
                                                              showSearch = false,
                                                              searchPlaceholder = '',
                                                              onSearch,
                                                              onSelect,
                                                              onRemove,
                                                              showMore = false,
                                                              onMoreClick
                                                          }) => {
    const [internalSearchTerm, setInternalSearchTerm] = useState(searchTerm);

    // Sync internal search term with external searchTerm prop
    useEffect(() => {
        setInternalSearchTerm(searchTerm);
    }, [searchTerm]);

    // Handle search input changes
    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInternalSearchTerm(newValue);
        onSearch?.(newValue);
    };

    // Handle option click select/remove
    const handleOptionClick = (option: { value: string; count: number; selected: boolean }) => {
        option.selected ? onRemove(option.value) : onSelect(option.value);
    };

    return (
        <div className={styles.facetContainer} ref={useRef<HTMLDivElement>(null)} >
            {/* Facet title */}
            <h5 className={styles.facetTitle}>
                {label}
            </h5>

            {/* Options list */}
            {options.length > 0 && (
                <ul className={styles.facetOptionsList} >
                    {/* Search input */}
                    {showSearch && (
                        <input
                            type="text"
                            placeholder={searchPlaceholder || `Поиск в ${label.toLowerCase()}...`}
                            value={internalSearchTerm}
                            onChange={handleSearchInputChange}
                            className={styles.facetSearchInput}
                        />
                    )}

                    {/* Facet options */}
                    {options.map(opt => (
                        <li
                            key={opt.value}
                            onClick={() => handleOptionClick(opt)}
                            className={`${styles.facetOption} ${opt.selected ? styles.selected : ''}`}
                        >
                            <div className={styles.facetOptionIndicator} />
                            <span className={styles.facetOptionLabel}>{opt.value}</span>
                            <span className={styles.facetOptionCount}>({opt.count})</span>
                        </li>
                    ))}

                    {/* "Show more" button */}
                    {showMore && onMoreClick && (
                        <button onClick={onMoreClick} className={styles.showMoreButton}>
                            Показати більше
                        </button>
                    )}
                </ul>
            )}
        </div>
    );
};