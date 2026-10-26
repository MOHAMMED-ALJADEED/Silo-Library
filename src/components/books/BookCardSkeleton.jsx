import React, { memo } from "react";

function BookCardSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="aspect-[3/4] bg-muted animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-5 w-20 bg-muted rounded animate-pulse" />
        <div className="h-4 w-full bg-muted rounded animate-pulse" />
        <div className="h-3 w-2/3 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );
}

export default memo(BookCardSkeleton);