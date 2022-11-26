import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { getOptionsForVote } from "../utils/getRandomPokemon";
import { RouterOutputs } from "../utils/trpc";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const [[first, second], updateIds] = useState(getOptionsForVote());

  const firstPokemon = trpc.pokemonRouter.getPokemonById.useQuery({
    id: first,
  });

  const secondPokemon = trpc.pokemonRouter.getPokemonById.useQuery({
    id: second,
  });

  const voteMutation = trpc.pokemonRouter.castVote.useMutation();

  if (secondPokemon.isLoading || secondPokemon.isLoading) return null;

  const voteForRoundest = (selected: number) => {
    if (selected === first) {
      voteMutation.mutate({ votedFor: first, votedAgainst: second });
    } else {
      voteMutation.mutate({ votedFor: second, votedAgainst: first });
    }
    updateIds(getOptionsForVote());
  };

  return (
    <>
      <Head>
        <title>Roundest Mon</title>
        <meta name="description" content="Vote on which pokemon is rounder?" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#31ab26] to-[#15162c]">
        <div className="container relative flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Who&apos;s <span className="text-[hsl(310,85%,13%)]">Rounder?</span>
          </h1>
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
        </div>
        <div className="absolute bottom-0 w-full pb-2 text-center text-xl text-white">
          <a href="https://www.github.com/samratjha96/roundest-mon">Github</a>
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
    <div className="flex h-64 w-64 flex-col bg-gradient-to-b from-[#1782c9] to-[#c75d29]">
      {props.pokemon?.sprites?.front_default && (
        <div className="relative h-full w-full">
          <Image
            src={props.pokemon.sprites.front_default}
            layout="fill" // required
            alt={props.pokemon.name}
            onClick={() => props.vote()}
            className="hover:cursor-pointer"
          />
        </div>
      )}
      <div className="bg-red-50 text-center text-xl capitalize">
        {props.pokemon?.name}
      </div>
    </div>
  );
};

export default Home;
