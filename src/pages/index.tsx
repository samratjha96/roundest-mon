import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { getOptionsForVote } from "../utils/getRandomPokemon";

import { trpc } from "../utils/trpc";

const buttonClasses =
  "inline-block rounded bg-blue-600 px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg";

const Home: NextPage = () => {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  const [[first, second], updateIds] = useState(getOptionsForVote());

  const firstPokemon = trpc.pokemonRouter.getPokemonById.useQuery({
    id: first,
  });

  const secondPokemon = trpc.pokemonRouter.getPokemonById.useQuery({
    id: second,
  });

  if (secondPokemon.isLoading || secondPokemon.isLoading) return null;

  const voteForRoundest = (selected: number) => {
    updateIds(getOptionsForVote());
  };

  return (
    <>
      <Head>
        <title>Roundest Mon</title>
        <meta name="description" content="Vote on which pokemon is rounder?" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Who's <span className="text-[hsl(280,100%,70%)]">Rounder?</span>
          </h1>
          {hydrated && (
            <div className="flex items-center justify-between rounded border p-8">
              <div className="flex h-64 w-64 flex-col items-center bg-gradient-to-b from-[#1782c9] to-[#c75d29]">
                {firstPokemon.data?.sprites?.front_default && (
                  <div className="relative h-full w-full">
                    <Image
                      src={firstPokemon.data.sprites.front_default}
                      layout="fill" // required
                      alt={firstPokemon.data.name}
                      className="h-full w-full"
                    />
                  </div>
                )}
                <div className="text-center text-xl capitalize text-white">
                  {firstPokemon.data?.name}
                </div>
                <button
                  type="button"
                  className={buttonClasses}
                  onClick={() => voteForRoundest(first)}
                >
                  Rounder
                </button>{" "}
              </div>
              <span className="p-4 text-2xl text-white">VS</span>

              <div className="flex h-64 w-64 flex-col items-center bg-gradient-to-b from-[#1782c9] to-[#c75d29]">
                {secondPokemon.data?.sprites?.front_default && (
                  <div className="relative h-full w-full">
                    <Image
                      src={secondPokemon.data.sprites.front_default}
                      layout="fill" // required
                      alt={secondPokemon.data.name}
                      className="h-full w-full"
                    />
                  </div>
                )}
                <div className="text-center text-xl capitalize text-white">
                  {secondPokemon.data?.name}
                </div>
                <button
                  type="button"
                  data-mdb-ripple="true"
                  data-mdb-ripple-color="light"
                  className={buttonClasses}
                  onClick={() => voteForRoundest(second)}
                >
                  Rounder
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
