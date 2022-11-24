const maxDexId = 493;
export const getRandomPokemon: (notThisOne?: number) => number = (
  notThisOne?: number
) => {
  const pokedexNumber = Math.floor(Math.random() * (maxDexId - 1));
  if (pokedexNumber !== notThisOne) return pokedexNumber;
  return getRandomPokemon(notThisOne);
};

export const getOptionsForVote = () => {
  const firstId = getRandomPokemon();
  const secondId = getRandomPokemon(firstId);

  return [firstId, secondId];
};
