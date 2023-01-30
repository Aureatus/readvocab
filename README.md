
# Readvocab
Readvocab is an app that allows users to upload PDF's, and see a descending list of the rarest words found within per the rarity of words in the english language, along with their definitions and grammatical class. To see other features, visit the features subheading.

The finding of rare words is handled by the `corpus-word-freq` npm package, written for this project. It can be found at https://github.com/Aureatus/corpus-word-freq.

Word rarity is based upon List 1.1, the complete list without frequency cut-offs found at https://ucrel.lancs.ac.uk/bncfreq/flists.html , which is itself based on the British National Corpus.

## Table of Contents
* [Features](#features)
* [Roadmap](#roadmap)
* [Known Issues](#known-issues)
* [Tech stack](#tech-stack)
* [Run locally](#run-locally)
  * [Frontend](#frontend)
  * [Backend](#backend)



## Features
- Cross platform (Web and android)
- Can upload a PDF and see rare words.
- Can see rare words from a random PDF that is in the database.
- Can save words if logged in.
## Roadmap

- Return a set amount of words each time.
  - Further, let user select an amount of words to get.
- Support for ebooks, and other formats that a book/long text may come in.
- Ability to search uploaded PDF's.
- Be able to get a list of most common words.
    - Following this, allow users to have separate saved word lists for rare words, and for common words.

- Allow customisation of what grammatical classes to exclude from returned result. (This one will rely largely on changes made to the corpus-word-freq package)

For goals with relation to the rare words refer to the `corpus-word-freq` readme.

## Known Issues

- Hacky XMLHttpRequest implementation to deal with server sent events results in having to add extra time to any event if it has been less than 150ms since the last event.
   - Reason for this is that for some reason that I haven't yet been able to assertain, events aren't caught by XMlHttpRequest if it's been less than 140-150ms since the last one.
   - Definitely an issue I want to resolve, but not that pressing, since the user experience with this implementation is still **far** better than just doing a single request for the response and having no loading data.

- Word rarity isn't up to scratch, but this is down to the word data used and the package i'm using to get definitions for words.
  - Particular offenders currently are `large`, `crisp` and `getting`. All of which are rare words according to the data, but with grammatical classes that aren't classified, so finding a definition for them is tricky. At present, I have the definition getting for words who's grammatical class is NoC( Not otherwise Classified),which the aforementioned terms are,set to nouns. This was the result of a misunderstanding of the grammatical class abbreviations early on.
  - Should be fairly easy to resolve, but to resolve it *well* will be more difficult. I will first fix it in a way which is quick and efficient, then look onto more robust solution later down the line.
- Returned words are often not unique to books, due to the abundance of words in the corpus data that have a frequency of 0 per million words. This is an issue that can be resolved in a number of ways, some better for the user, but worse for the predictability of the apps function, and for the devs working on it, others inversely so.
  - One of the most promising solutions at present would be to incorporate the diversity of words into the ranking of a words rarity, rather than just it's frequency. This would involve using another dataset from the same source as the word frequency data. This issue would be one that is resolved wholly through the `corpus-word-freq` package, rather than the app.
  - A quick and easy solution  that could be hacked together whilst a better solution is being developed would be to simply get more rare words than required from the corpus, and picking a set amount of random words from it. This wouldn't be an ideal thing to implement for various reasons, so i'll avoid it if possible.

- An issue that isn't a problem yet, but will become one down the line, is the fact that any updated implementations of what a rare word is would invalidate the PDF data already cached on the database, so each improvement would set the user experience back in that area. I haven't thought about this problem too much yet, and as such only have one idea as to how to offset the issues effect.
  - Said idea is to always calculate the rare words for a PDF that is uploaded, even if the PDF is already cached, and save it if the data is different.
    - Rare word calculation would take place *after* the request is fulfilled, so the user experience wouldn't suffer with unneedingly heightened loading speeds.
    - Could add some sort of versioning system and only have this implementation take place if the PDF in question was last updated prior to a new update that changed what words might be returned from a PDF. This would mostly be important if I was trying to grow the userbase, because otherwise it wouldn't scale well at all, and i'd likely have to start paying for the server hosting.

## Tech Stack

**Client:** React native(Expo), TypeScript

**Server:** Fastify, Typescript, MongoDB


## Run Locally

Clone the project

```bash
  git clone https://github.com/Aureatus/readvocab.git
```

#### Frontend
Go to the project directory

```bash
  cd readvocab/frontend
```

Install dependencies

```bash
  npm install
```

Provide environment variable for API_URL. For it to work on android, it must be https, but for web it doesn't matter.

Start the server

```bash
  npm run start
```

#### Backend
Go to the project directory

```bash
  cd readvocab/backend
```

Install dependencies

```bash
  npm install
```

Provide environment variables for JWT_SECRET, PORT and MONGO_URL.

Start the server

```bash
  npm run dev
```

