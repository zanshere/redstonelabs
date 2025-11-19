import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Welcome() {
    const [redirectMessage, setRedirectMessage] = useState('Checking connection...');
    const [connectionSpeed, setConnectionSpeed] = useState<'slow' | 'medium' | 'fast'>('medium');

    useEffect(() => {
        const measureConnectionSpeed = async () => {
            const imageUrl = 'https://source.unsplash.com/random/100x100'; // Gambar kecil untuk test
            const startTime = Date.now();

            try {
                const response = await fetch(imageUrl, { method: 'HEAD' });
                const endTime = Date.now();
                const duration = endTime - startTime;

                // Tentukan kecepatan koneksi berdasarkan waktu response
                if (duration < 300) {
                    setConnectionSpeed('fast');
                    setRedirectMessage('Fast connection detected. Redirecting quickly...');
                } else if (duration < 1000) {
                    setConnectionSpeed('medium');
                    setRedirectMessage('Standard connection. Redirecting shortly...');
                } else {
                    setConnectionSpeed('slow');
                    setRedirectMessage('Slow connection detected. Please wait...');
                }
            } catch (error) {
                // Fallback jika test gagal
                setConnectionSpeed('medium');
                setRedirectMessage('Redirecting to application...');
            }
        };

        const performRedirect = () => {
            // Tentukan delay berdasarkan kecepatan koneksi
            let delay: number;

            switch (connectionSpeed) {
                case 'fast':
                    delay = 1000; // 1 detik untuk koneksi cepat
                    break;
                case 'slow':
                    delay = 5000; // 5 detik untuk koneksi lambat
                    break;
                default:
                    delay = 2500; // 2.5 detik untuk koneksi sedang
            }

            setRedirectMessage(`Redirecting in ${delay/1000} seconds...`);

            const redirectTimer = setTimeout(() => {
                window.location.href = 'http://localhost:3000/';
            }, delay);

            return () => clearTimeout(redirectTimer);
        };

        // Jalankan test koneksi terlebih dahulu
        measureConnectionSpeed().then(() => {
            // Setelah test selesai, jalankan redirect dengan delay yang sesuai
            performRedirect();
        });

    }, [connectionSpeed]);

    // Tampilan UI yang informatif
    return (
        <>
            <Head title="Redirecting..." />
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#FDFDFC] p-6 dark:bg-[#0a0a0a]">
                <div className="max-w-md text-center">
                    {/* Connection Indicator */}
                    <div className="mb-6">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            connectionSpeed === 'fast'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : connectionSpeed === 'slow'
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}>
                            <span className={`w-2 h-2 rounded-full mr-2 ${
                                connectionSpeed === 'fast'
                                    ? 'bg-green-500'
                                    : connectionSpeed === 'slow'
                                        ? 'bg-yellow-500'
                                        : 'bg-blue-500'
                            }`}></span>
                            {connectionSpeed === 'fast'
                                ? 'Fast Connection'
                                : connectionSpeed === 'slow'
                                    ? 'Slow Connection'
                                    : 'Standard Connection'
                            }
                        </div>
                    </div>

                    {/* Main Message */}
                    <h2 className="text-xl font-semibold text-[#1b1b18] dark:text-[#EDEDEC] mb-4">
                        Welcome to Our App
                    </h2>

                    <p className="text-[#706f6c] dark:text-[#A1A09A] mb-6">
                        {redirectMessage}
                    </p>

                    {/* Animated Loading */}
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="h-12 w-12 rounded-full border-4 border-[#f0f0f0] dark:border-[#333]"></div>
                            <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-4 border-transparent border-t-[#f53003] dark:border-t-[#FF4433] animate-spin"></div>
                        </div>
                    </div>

                    {/* Manual Redirect Option */}
                    <div className="border-t border-[#e3e3e0] dark:border-[#3E3E3A] pt-6">
                        <p className="text-sm text-[#706f6c] dark:text-[#A1A09A] mb-3">
                            If redirect doesn't work, click the button below:
                        </p>
                        <button
                            onClick={() => window.location.href = 'http://localhost:3000/'}
                            className="inline-flex items-center px-4 py-2 bg-[#f53003] text-white rounded-lg hover:bg-[#d42a03] transition-colors dark:bg-[#FF4433] dark:hover:bg-[#ff5533]"
                        >
                            Go to Application
                            <svg
                                className="ml-2 w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Connection Speed Info */}
                    <div className="mt-6 text-xs text-[#a1a09a] dark:text-[#706f6c]">
                        <p>
                            {connectionSpeed === 'fast'
                                ? '✓ Your connection is fast. You\'ll be redirected quickly.'
                                : connectionSpeed === 'slow'
                                    ? '⏳ Your connection is slow. We\'ve added extra time for loading.'
                                    : '↻ Your connection speed is normal. Redirecting at standard pace.'
                            }
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
