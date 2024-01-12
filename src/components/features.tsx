import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  LockClosedIcon,
} from '@heroicons/react/20/solid';

const features = [
  {
    name: 'Ready for public repositories',
    description:
      'Just paste the URL of your public repository and we will index it for you. No need to install anything.',
    href: '#app',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Support for private repositories',
    description:
      'Need to search your private repositories? We support that too. Just head to our documentation to learn how to set it up. Ah, we also support GitHub Enterprise.',
    href: '/GitGlean.postman_collection.json',
    icon: LockClosedIcon,
  },
  {
    name: 'Well documented API',
    description:
      'Want to integrate with your own tooling? We have a well documented API that you can use to integrate with your own tooling. All you need to do is to import our Postman collection.',
    href: '/GitGlean.postman_collection.json',
    icon: DocumentTextIcon,
  },
];

export default function Features() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            Search more efficiently
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Semantic search for your codebase
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Import your codebase and start searching. We&apos;ll automatically
            index your codebase and make it searchable. Simply use... your own
            words.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon
                    className="h-5 w-5 flex-none text-indigo-600"
                    aria-hidden="true"
                  />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                  <p className="mt-6">
                    <a
                      href={feature.href}
                      className="text-sm font-semibold leading-6 text-indigo-600"
                    >
                      Learn more <span aria-hidden="true">→</span>
                    </a>
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
