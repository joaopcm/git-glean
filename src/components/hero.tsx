import {
  ChevronRightIcon,
  DocumentMagnifyingGlassIcon,
} from '@heroicons/react/20/solid';

export default function Hero() {
  return (
    <div className="bg-white">
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20">
        <div className="mx-auto max-w-7xl pb-24 pt-10 sm:pb-32 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-40">
          <div className="px-6 lg:px-0 lg:pt-4">
            <div className="mx-auto max-w-2xl">
              <div className="max-w-lg">
                {/* <img
                  className="h-11"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  alt="GitGlean"
                /> */}
                <DocumentMagnifyingGlassIcon className="h-11 w-11 text-indigo-600" />
                <div className="mt-24 sm:mt-32 lg:mt-16">
                  <a href="#" className="inline-flex space-x-6">
                    <span className="rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10">
                      {/* What&apos;s new */}
                      Recently launched
                    </span>
                    <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600">
                      <span>Just shipped v0.1.0</span>
                      <ChevronRightIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </a>
                </div>
                <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Supercharge your open-source search
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Instantly search and extract top documents from public
                  repositories with unparalleled ease and precision.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <a
                    href="#"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Get started
                  </a>
                  <a
                    href="https://github.com/trending"
                    target="_blank"
                    className="text-sm font-semibold leading-6 text-gray-900"
                  >
                    Find trending GitHub repositories{' '}
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-20 sm:mt-24 md:mx-auto md:max-w-2xl lg:mx-0 lg:mt-0 lg:w-screen">
            <div
              className="absolute inset-y-0 right-1/2 -z-10 -mr-10 w-[200%] skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 md:-mr-20 lg:-mr-36"
              aria-hidden="true"
            />
            <div className="shadow-lg md:rounded-3xl">
              <div className="bg-indigo-500 [clip-path:inset(0)] md:[clip-path:inset(0_round_theme(borderRadius.3xl))]">
                <div
                  className="absolute -inset-y-px left-1/2 -z-10 ml-10 w-[200%] skew-x-[-30deg] bg-indigo-100 opacity-20 ring-1 ring-inset ring-white md:ml-20 lg:ml-36"
                  aria-hidden="true"
                />
                <div className="relative px-6 pt-8 sm:pt-16 md:pl-16 md:pr-0">
                  <div className="mx-auto max-w-2xl md:mx-0 md:max-w-none">
                    <div className="w-screen overflow-hidden rounded-tl-xl bg-gray-900">
                      <div className="flex bg-gray-800/40 ring-1 ring-white/5">
                        <div className="-mb-px flex text-sm font-medium leading-6 text-gray-400">
                          <div className="border-b border-r border-b-white/20 border-r-white/10 bg-white/5 px-4 py-2 text-white">
                            NotificationSetting.jsx
                          </div>
                          <div className="border-r border-gray-600/10 px-4 py-2">
                            App.jsx
                          </div>
                        </div>
                      </div>
                      <div className="px-6 pb-14 pt-6">
                        <pre className="text-[0.8125rem] leading-6 text-gray-300">
                          <code>
                            import{' '}
                            {<span className="text-[#7dd3fc]">useState</span>}{' '}
                            from{' '}
                            <span className="text-emerald-300">
                              &#39;react&#39;
                            </span>
                            <br />
                            import{' '}
                            {
                              <span className="text-[#7dd3fc]">Switch</span>
                            }{' '}
                            from{' '}
                            <span className="text-emerald-300">
                              &#39;@headlessui/react&#39;
                            </span>{' '}
                            <br />
                            <br />
                            <span className="text-indigo-400">
                              function Example
                            </span>
                            &#40;&#41; &#123;
                            <br />
                            <span> const</span> [
                            <span className="text-[#7dd3fc]">enabled</span>,{' '}
                            <span className="text-[#7dd3fc]">setEnabled</span>]
                            = useState(
                            <span className="text-[#7dd3fc]">true</span>) <br />
                            <br /> return (<br /> &nbsp;&nbsp;&lt;
                            <span className="text-indigo-400">form</span>{' '}
                            action=&#34;/
                            <span className="text-emerald-300">
                              notification-settings
                            </span>
                            &#34; method=&#34;
                            <span className="text-emerald-300">post</span>
                            &#34;&gt;
                            <br /> &nbsp;&nbsp;&nbsp;&nbsp;&lt;
                            <span className="text-indigo-400">Switch</span>{' '}
                            checked=&#34;
                            {<span className="text-[#7dd3fc]">enabled</span>}
                            &#34; onChange=&#34;
                            {<span className="text-[#7dd3fc]">setEnabled</span>}
                            &#34; name=&#34;
                            <span className="text-emerald-300">
                              notifications
                            </span>
                            &#34;&gt;
                            <br /> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            {
                              <span className="text-gray-500">
                                &#47;* ... *&#47;
                              </span>
                            }
                            <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/
                            <span className="text-indigo-400">Switch</span>
                            &gt;
                            <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;
                            <span className="text-indigo-400">button</span>
                            &gt;Submit&lt;/
                            <span className="text-indigo-400">button</span>&gt;
                            <br />
                            &nbsp;&nbsp;&nbsp;&lt;/
                            <span className="text-indigo-400">form</span>
                            &gt;
                            <br />
                            &nbsp;)
                            <br />
                            &#125;
                          </code>
                        </pre>
                      </div>
                    </div>
                  </div>
                  <div
                    className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10 md:rounded-3xl"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white sm:h-32" />
      </div>
    </div>
  );
}