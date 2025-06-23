"use client";

export function DateClient({ date }: { date: string }) {
  return <>{new Date(date).toLocaleDateString()}</>;
} 