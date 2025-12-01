import React from 'react';
import {SearchApp} from '@/components/SearchApp';
import Header from '@/components/ui/Header/Header';


export default function HomePage() {
    return (
        <main className="min-h-screen p-8" >
            <Header/>
            <SearchApp/>
        </main>
    );
}