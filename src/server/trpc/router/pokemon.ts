import { z } from "zod";

import { router, publicProcedure } from "../trpc";
import { PokemonClient } from "pokenode-ts";

export const pokemonRouter = router({
  getPokemonById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const pokemonApiConnection = new PokemonClient();
      const pokemon = await pokemonApiConnection.getPokemonById(input.id);
      return { sprites: pokemon.sprites, name: pokemon.name };
    }),
  castVote: publicProcedure
    .input(z.object({ votedFor: z.number(), votedAgainst: z.number() }))
    .mutation(async ({ input }) => {
      const voteInDb = await prisma?.vote.create({
        data: {
          ...input,
        },
      });
      return { success: true, vote: voteInDb };
    }),
});
