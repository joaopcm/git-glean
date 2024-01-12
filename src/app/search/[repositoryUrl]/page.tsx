'use client';

import { Disclosure } from '@headlessui/react';
import { DocumentMagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useCallback, useState } from 'react';

type SearchAPIResponse = {
  id: string;
  source: string;
  pageContent: string;
}[];

const navigation = [{ name: 'Get back to home', href: '/', current: false }];

interface SearchProps {
  params: { repositoryUrl: string };
}

export default function Search({ params }: SearchProps) {
  const decodedRepositoryUrl = decodeURIComponent(params.repositoryUrl);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchAPIResponse>([]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setIsLoading(true);

      const response = await fetch(`/api/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repositoryUrl: decodedRepositoryUrl,
          input: searchParams.get('q'),
        }),
      });
      const result = (await response.json()) as SearchAPIResponse;

      if ('error' in result) {
        throw new Error(result.error as string);
      }

      setResults(result);
    } catch (error) {
      console.error(JSON.stringify(error));
      alert('Something went wrong! Check your console for more details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full">
      <div className="bg-indigo-700 pb-32">
        <Disclosure as="nav" className="bg-indigo-600">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between px-4 sm:px-0">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <DocumentMagnifyingGlassIcon className="h-11 w-11 text-white" />
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="text-white hover:bg-indigo-700 rounded-md px-3 py-2 text-sm font-medium"
                            aria-current={item.current ? 'page' : undefined}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-indigo-600 p-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-800">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="border-b border-gray-700 md:hidden">
                <div className="space-y-1 px-2 py-3 sm:px-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className="text-white hover:bg-indigo-700 block rounded-md px-3 py-2 text-base font-medium"
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <header className="py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Searching in &quot;{decodedRepositoryUrl}&quot;...
            </h1>
          </div>
        </header>
      </div>

      <main className="-mt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="w-[100%] flex space-x-2">
            <input
              type="text"
              className="flex flex-1 rounded-md border-0 px-8 py-7 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 md:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-white"
              placeholder='e.g. Where do I use the "useState" hook most?'
              value={searchParams.get('q') || ''}
              onChange={(e) =>
                router.push(
                  pathname + '?' + createQueryString('q', e.target.value),
                )
              }
              disabled={isLoading}
            />

            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-6 py-1 sm:text-sm md:text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!searchParams.get('q') || isLoading}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>
      </main>

      <div className="mt-24">
        <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <ul role="list" className="divide-y divide-gray-100">
            {results.map((result, index) => (
              <li
                key={result.id}
                className="flex items-center justify-between gap-x-6 py-5"
              >
                <div className="min-w-0">
                  <div className="flex items-start gap-x-3">
                    <span className="text-gray-400">#{index + 1}</span>
                    <p className="text-sm font-semibold leading-6 text-gray-900">
                      {result.source}
                    </p>
                  </div>
                </div>
                <div className="flex flex-none items-center gap-x-4">
                  <a
                    href={decodedRepositoryUrl + '/blob/main/' + result.source}
                    target="_blank"
                    className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
                  >
                    View file
                    <span className="sr-only">, {result.source}</span>
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
