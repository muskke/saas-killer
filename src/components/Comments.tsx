'use client';

import Giscus from '@giscus/react';

export default function Comments() {
  // Configuration for Giscus from environment variables
  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY;
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

  // Check if Giscus is configured
  const isConfigured =
    repo &&
    repoId &&
    category &&
    categoryId &&
    repo !== "enter/repo" &&
    repoId !== "ENTER_REPO_ID_HERE" &&
    category !== "ENTER_CATEGORY_NAME_HERE" &&
    categoryId !== "ENTER_CATEGORY_ID_HERE";

  if (!isConfigured) {
    return (
      <div className="mt-10 pt-10 border-t border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-bold mb-6">Comments</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-yellow-800">
          <h3 className="font-bold text-lg mb-2">⚠️ Comments Not Configured</h3>
          <p className="mb-4">
            To enable comments, you need to configure Giscus environment variables in your
            <code className="bg-yellow-100 px-2 py-1 rounded mx-1 text-sm">.env</code> file.
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Go to <a href="https://giscus.app" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-900">giscus.app</a></li>
            <li>Follow the instructions to enable Giscus for your repository</li>
            <li>Copy the <strong>Repository ID</strong> and <strong>Category ID</strong></li>
            <li>Update the Giscus environment variables in your <code>.env</code> file:
              <pre className="bg-yellow-100 p-2 rounded mt-2 text-xs">
{`NEXT_PUBLIC_GISCUS_REPO=your-username/your-repo
NEXT_PUBLIC_GISCUS_REPO_ID=R_kgDO...
NEXT_PUBLIC_GISCUS_CATEGORY=General
NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_...`}
              </pre>
            </li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 pt-10 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>
      <Giscus
        id="comments"
        repo={repo! as `${string}/${string}`}
        repoId={repoId!}
        category={category!}
        categoryId={categoryId!}
        mapping="pathname"
        term="Welcome to @giscus/react component!"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="preferred_color_scheme"
        lang="en"
        loading="lazy"
      />
    </div>
  );
}
