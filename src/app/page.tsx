'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

import Features from '@/components/features';
import Hero from '@/components/hero';

export default function Home() {
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      setIsLoading(true);
      const response = await fetch('/api/ingest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repositoryUrl }),
      });
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      router.push(`/search/${encodeURIComponent(repositoryUrl)}`);
    } catch (error) {
      console.error(JSON.stringify(error));
      alert('Something went wrong! Check your console for more details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Hero />

      <div id="app" className="relative isolate overflow-hidden bg-gray-900">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Let the magic begin
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Provide a public GitHub repository URL to index and search its
              source code.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <form onSubmit={handleSubmit} className="w-[70%] flex space-x-2">
                <input
                  type="url"
                  className="flex flex-1 rounded-md border-0 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-white"
                  placeholder="https://github.com/joaopcm/nodepad"
                  value={repositoryUrl}
                  onChange={(e) => setRepositoryUrl(e.target.value)}
                  disabled={isLoading}
                />

                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-3 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!repositoryUrl || isLoading}
                >
                  {isLoading ? 'Indexing...' : 'Search'}
                </button>
              </form>
            </div>
          </div>
        </div>
        <svg
          viewBox="0 0 1024 1024"
          className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
          aria-hidden="true"
        >
          <circle
            cx={512}
            cy={512}
            r={512}
            fill="url(#8d958450-c69f-4251-94bc-4e091a323369)"
            fillOpacity="0.7"
          />
          <defs>
            <radialGradient id="8d958450-c69f-4251-94bc-4e091a323369">
              <stop stopColor="#4F46E5" />
              <stop offset={1} stopColor="#4F46E5" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <Features />
    </div>
  );
}
