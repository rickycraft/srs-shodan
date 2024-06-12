'use client';

import Link from 'next/link';
import React, {useEffect} from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log('Session:', session);
    console.log('Status:', status);
  }, [session, status]);

  const handleLogin = async () => {
    const result = await signIn('github');
    if (result?.url) {
      router.push(result.url);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          <span className="text-[hsl(280,100%,70%)]">SHODAN Monitoring</span> WebApp
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          {session ? (
            <div className="flex flex-col items-center">
              <p className="text-lg">Welcome, {session.user?.name}</p>
              <button
                className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                onClick={handleLogout}
              >
                <h3 className="text-2xl font-bold">Logout</h3>
              </button>
            </div>
          ) : (
            <button
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              onClick={handleLogin}
            >
              <h3 className="text-2xl font-bold">Login →</h3>
              <div className="text-lg">
                OAuth di GitHub
                <img src="/logoGitHub.png" alt="GitHub OAuth Login" />
              </div>
            </button>
          )}
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            href="https://github.com/rickycraft/srs-shodan"
            target="_blank"
          >
            <h3 className="text-2xl font-bold">Repo Github   →</h3>
            <div className="text-lg">
              Repository GitHub del Progetto di Scalable and Reliable Services M
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
