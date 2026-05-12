import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3 group">
      <div className="w-9 h-9 rounded-xl bg-stone-900 dark:bg-white flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
        <span className="text-white dark:text-zinc-900 font-bold text-xl leading-none">Q</span>
      </div>
      <span className="font-extrabold text-xl tracking-tight text-stone-900 dark:text-white">
        Q-Rate <span className="text-amber-500 dark:text-indigo-400 font-medium text-sm ml-1">Lite</span>
      </span>
    </Link>
  );
}
