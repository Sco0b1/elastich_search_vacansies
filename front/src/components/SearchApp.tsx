'use client';

import React from 'react';
import {
    SearchProvider,
    SearchBox,
    Results,
    Paging,
    PagingInfo,
    Facet,
    useSearch
} from '@elastic/react-search-ui';
import {
    SearchBox as SearchBoxView,
    Results as ResultsView,
    PagingInfo as PagingInfoView,
    Paging as PagingView,
    SingleSelectFacet
} from "@elastic/react-search-ui-views";

import ElasticsearchConnector from '@elastic/search-ui-elasticsearch-connector';
import {JobCard} from '@/components/ui/JobCard/JobCard';
import {CustomPagingView} from '@/components/ui/CustomPagingView/CustomPagingView';
import {CustomFacetView} from '@/components/ui/CustomFacetView/CustomFacetView';
import { SearchLayout } from '@/components/ui/SearchLayout/SearchLayout';
import {CustomSearchBoxView} from "@/components/ui/CustomSearchBoxView/CustomSearchBoxView";
import Link from 'next/link';
import styles from './SearchContent.module.css';

const connector = new ElasticsearchConnector({
    host: 'http://localhost:9200',
    index: 'it_jobs'
});


function SearchContent() {
    const {clearFilters, filters} = useSearch();


    return (
        <div className="min-h-screen"    >
            <div className="max-w-7xl mx-auto px-4 py-12">


                <div style={{ backgroundColor: '#4f46e5' }}>
                    <SearchBox
                        view={CustomSearchBoxView}
                        searchAsYouType
                        autocompleteSuggestions
                        inputProps={{
                            className: 'search-input'
                        }}
                    />
                </div>

                <SearchLayout
                    filters={
                        <div>
                            <Facet
                                field="location"
                                label="Локація"
                                view={CustomFacetView}
                            />
                            <Facet
                                field="salary"
                                label="Зарплата"
                                view={CustomFacetView}
                            />
                            <Facet
                                field="job_type"
                                label="Тип зайнятості"
                                view={CustomFacetView}
                            />
                            <div className={styles.addJobButtonContainer}>
                                <Link
                                    href="/add-job"
                                    className={styles.addJobButton}
                                >
                                    Додати вакансію
                                </Link>
                            </div>
                            <div className={styles.resetButtonContainer}>
                                <button
                                    onClick={() => clearFilters()}
                                    className={styles.resetButton}
                                >
                                    Скинути фільтри
                                </button>
                            </div>

                        </div>

                    }
                    content={
                        <div>

                            {filters && filters.length > 0 && (
                                <div className="flex justify-center mt-4">
                                    <button
                                        onClick={() => clearFilters()}
                                        className="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium"
                                    >
                                        Скинути фільтри
                                    </button>
                                </div>
                            )}

                            <div className="mt-8" >
                                <div className="text-center text-sm text-gray-600 mb-6">
                                    <PagingInfo view={PagingInfoView} />
                                </div>



                                <div className="result-container" >
                                    <Results
                                        view={ResultsView}
                                        resultView={JobCard}
                                    />
                                </div>
                                <div>
                                    <Paging
                                        view={CustomPagingView}
                                    />
                                </div>
                            </div>
                        </div>
                    }
                />
            </div>
        </div>
    );
}



export function SearchApp() {
    return (

        <SearchProvider
            config={{
                apiConnector: connector,
                searchQuery: {
                    search_fields: {
                        title: {weight: 3},
                        description: {weight: 1},
                        skills: {weight: 2}
                    },
                    result_fields: {
                        title: {snippet: {size: 100, fallback: true}},
                        description: {snippet: {size: 200, fallback: true}},
                        company: {raw: {}},
                        remote_type: {raw: {}},
                        location: {raw: {}},
                        experience_level: {raw: {}},
                        salary: {raw: {}},
                        employment_type: {raw: {}},
                        skills: {raw: {}}
                    },
                    facets: {
                        location: {
                            type: "value",
                            size: 100
                        },
                        salary: {
                            type: "range",
                            ranges: [
                                {to: 50000, name: "до $50k"},
                                {from: 50000, to: 100000, name: "$50k–100k"},
                                {from: 100000, to: 150000, name: "$100k–150k"},
                                {from: 150000, name: "більше $150k"}
                            ]
                        },
                        job_type: {
                            type: "value",
                            size: 10
                        }

                    }
                }
            }}
        >
            <SearchContent/>
        </SearchProvider>
    );
}