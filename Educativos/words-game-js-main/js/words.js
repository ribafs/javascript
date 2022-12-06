const words = [
  'Macaco',
  'Rosto',
  'Polvo',
  'Lua',
  'David',
  'Bebida',
  'Orelha',
  'Comida',
  'Dez',
  'Baleia',
  'Cabra',
  'Mochila',
  'Coelho',
  'Quadrado',
  'Prato',
  'Tabela',
  'Pele',
  'Giz',
  'Professor',
  'Banana',
  'Melancia',
  'Tijolo',
  'Gato',
  'Garfo',
  'Urso',
  'Gelo'
]

const letters = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z'
]

export function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * (words.length + 1))

  return words[randomIndex]
}

function checkLettersIncluded(wordSpread) {
  const indexes = wordSpread.map(wordLetter =>
    letters.findIndex(letter => letter === wordLetter.toUpperCase())
  )

  return indexes
}

export function getSequenceLetters(needToInclude) {
  const indexes = checkLettersIncluded([...needToInclude])

  const sequenceLength = 16 - needToInclude.length

  const sequenceLetters = letters.filter((letter, index) => {
    if (!indexes.includes(index)) return letter
  })

  sequenceLetters.length = sequenceLength

  return sequenceLetters
}
