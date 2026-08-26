import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  actionHref,
  onAction,
}) => {
  return (
    <div className="py-16 px-4 text-center max-w-md mx-auto flex flex-col items-center select-none">
      {/* Editorial Glyph */}
      <div className="w-12 h-12 rounded-full border border-[#0A0A0A] flex items-center justify-center text-xl font-serif-accent mb-4 text-[#0A0A0A]">
        *
      </div>
      <h3 className="text-xl font-semibold font-display text-[#0A0A0A] mb-2">
        {title}
      </h3>
      <p className="text-sm text-[#6B6B6B] leading-relaxed mb-6">
        {description}
      </p>
      {actionText && (
        actionHref ? (
          <Button asAnchor href={actionHref} variant="primary">
            {actionText}
          </Button>
        ) : (
          <Button onClick={onAction} variant="primary">
            {actionText}
          </Button>
        )
      )}
    </div>
  );
};
