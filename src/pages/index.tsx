import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { getOptionsForVote } from "../utils/getRandomPokemon";
import { RouterOutputs } from "../utils/trpc";

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
              {!firstPokemon.isLoading &&
                firstPokemon.data &&
                !secondPokemon.isLoading &&
                secondPokemon.data && (
                  <PokemonListing
                    pokemon={firstPokemon.data}
                    vote={() => voteForRoundest(first)}
                  ></PokemonListing>
                )}
              <span className="p-4 text-2xl text-white">VS</span>
              {!firstPokemon.isLoading &&
                firstPokemon.data &&
                !secondPokemon.isLoading &&
                secondPokemon.data && (
                  <PokemonListing
                    pokemon={secondPokemon.data}
                    vote={() => voteForRoundest(second)}
                  ></PokemonListing>
                )}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

type PokemonFromServer = RouterOutputs["pokemonRouter"]["getPokemonById"];

const PokemonListing: React.FC<{
  pokemon: PokemonFromServer;
  vote: () => void;
}> = (props) => {
  return (
    <div className="flex h-64 w-64 flex-col items-center bg-gradient-to-b from-[#1782c9] to-[#c75d29]">
      {props.pokemon?.sprites?.front_default && (
        <div className="relative h-full w-full">
          <Image
            src={props.pokemon.sprites.front_default}
            layout="fill" // required
            alt={props.pokemon.name}
          />
        </div>
      )}
      <div className="text-center text-xl capitalize text-white">
        {props.pokemon?.name}
      </div>
      <button
        type="button"
        data-mdb-ripple="true"
        data-mdb-ripple-color="light"
        className={buttonClasses}
        onClick={() => props.vote()}
      >
        Rounder
      </button>
    </div>
  );
};

export default Home;
