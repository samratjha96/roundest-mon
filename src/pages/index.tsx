import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getOptionsForVote } from "../utils/getRandomPokemon";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  const [first, second] = getOptionsForVote();

  return (
    <>
      <Head>
        <title>Roundest Mon</title>
        <meta name="description" content="Vote on which pokemon is rounder?" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          {hydrated && (
            <div className="flex items-center justify-between rounded border p-8">
              <div className="h-16 w-16 bg-gradient-to-b from-[#1782c9] to-[#c75d29]">
                <span className="py-6 px-4 text-2xl text-white">{first}</span>
              </div>
              <span className="p-4 text-2xl text-white">VS</span>

              <div className="h-16 w-16 bg-gradient-to-b from-[#1782c9] to-[#c75d29]">
                <span className="py-6 px-4 text-2xl text-white">{second}</span>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
