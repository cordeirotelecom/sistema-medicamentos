'use client';

import { AlertTriangle } from 'lucide-react';

interface UnsavedChangesIndicatorProps {
  hasUnsavedChanges: boolean;
}

export default function UnsavedChangesIndicator({ hasUnsavedChanges }: UnsavedChangesIndicatorProps) {
  if (!hasUnsavedChanges) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-pulse">
        <AlertTriangle className="w-4 h-4" />
        <span className="text-sm font-medium">
          Alterações não salvas
        </span>
      </div>
    </div>
  );
}
