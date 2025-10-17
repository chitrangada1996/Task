import React from 'react';
import { FileText } from './icons';

export const PlanningDocs: React.FC = () => {
    return (
        <div className="h-full flex items-center justify-center p-6 text-center">
            <div className="max-w-2xl">
                <FileText className="mx-auto h-16 w-16 text-muted-foreground mb-4" strokeWidth={1} />
                <h1 className="text-2xl font-bold text-foreground">Planning Documents</h1>
                <p className="mt-2 text-muted-foreground">
                    This is the central hub for all your project briefs, specifications, and strategic plans.
                </p>
                <p className="mt-1 text-muted-foreground text-sm">
                    Currently under construction. Check back soon!
                </p>
            </div>
        </div>
    );
};