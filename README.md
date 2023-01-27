
# Readvocab
Readvocab is an app that allows users to upload PDF's, and see a descending list of the rarest words found within per the rarity of words in the english language, along with their definitions and grammatical class. To see other features, visit the features subheading.

The finding of rare words is handled by the `corpus-word-freq` npm package, developed by me for this project. It can be found at https://github.com/Aureatus/corpus-word-freq.

Word rarity is based upon List 1.1, the complete list without frequency cut-offs found at https://ucrel.lancs.ac.uk/bncfreq/flists.html , which is itself based on the British National Corpus.

## Features
- Cross platform (Web and android)
- Can upload a PDF and see rare words.
- Can see rare words from a random PDF that is in the database.
- Can save words if logged in.

## Roadmap

- Return a set amount of words each time.
- Support for ebooks, and other formats that a book/long text may come in.
- Ability to search uploaded PDF's.
- Be able to get a list of most common words.
    - Following this, allow users to have separate saved word lists for rare words, and for common words.

- Let user select an amount of words to get.
- Allow customisation of what grammatical classes to exclude from returned result. (This one will rely largely on changes made to the corpus-word-freq package)

For goals with relation to the rare words refer to the `corpus-word-freq` readme.

## Tech Stack

**Client:** React native(Expo), TypeScript

**Server:** Fastify, Typescript, MongoDB

