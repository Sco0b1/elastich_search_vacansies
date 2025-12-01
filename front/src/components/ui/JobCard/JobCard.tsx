'use client';

import React from 'react';
import { ResultViewProps } from '@elastic/react-search-ui-views';
import styles from './JobCard.module.css';

export const JobCard: React.FC<ResultViewProps> = ({ result, onClickLink = () => {} }) => {
    const titleRaw = result.title?.snippet ?? result.title?.raw ?? 'No title available';
    const detailsRaw = result.description?.snippet ?? result.description?.raw ?? 'No description available';
    const location = (result.location?.raw ?? '').toString();
    const company = (result.company?.raw ?? 'Unknown company').toString();

    // Function to create a safe HTML element
    const createMarkup = (html: string) => {
        return { __html: html };
    };

    return (
        <div className={styles.jobCard} onClick={() => onClickLink()} >
            <h3
                className={styles.jobTitle}
                dangerouslySetInnerHTML={createMarkup(titleRaw)}
            />
            <p className={styles.jobCompany}>{company}</p>
            <div
                className={styles.jobDetails}
                dangerouslySetInnerHTML={createMarkup(detailsRaw)}
            />
            <p className={styles.location}>{location || 'Location not specified'}</p>
        </div>
    );
};














{/*'use client';

import React from 'react';
import { ResultViewProps } from '@elastic/react-search-ui-views';
import styles from './JobCard.module.css';

export const JobCard: React.FC<ResultViewProps> = ({ result, onClickLink = () => {} }) => {
    const title = (result.title?.snippet ?? result.title?.raw ?? 'No title available').toString();
    const detailsRaw = result.description?.snippet ?? result.description?.raw ?? 'No description available';
    const details = typeof detailsRaw === 'string' ? detailsRaw.split('\n')[0] || detailsRaw : String(detailsRaw);
    const location = (result.remote_type?.raw ?? '').toString();
    const company = (result.company?.raw ?? 'Unknown company').toString();

    return (
        <div className={styles.jobCard} onClick={() => onClickLink()}>
            <h3 className={styles.jobTitle}>{title}</h3>
            <p className={styles.jobCompany}>{company}</p>
            <p className={styles.jobDetails}>{details}</p>
            <p className={styles.location}>{location || 'Location not specified'}</p>
        </div>
    );
};

 */}