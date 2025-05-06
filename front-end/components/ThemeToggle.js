import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [ mounted, setMounted ] = useState(false);

    useEffect(() => setMounted(true), []);

    if(!mounted) return null;

    return (
        <button className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
        </button>
    )
}