import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [ mounted, setMounted ] = useState(false);

    useEffect(() => setMounted(true), []);

    if(!mounted) return null;

    return (
        <button className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
            Toggle to {theme === 'dark' ? 'Light' : 'Dark'} Mode
        </button>
    )
}