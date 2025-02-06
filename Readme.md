# URL Shortener

A simple URL shortener that makes a long URL _"bit sized"_. Written in Vanilla HTML/CSS, JS and Node.Js.

> [!WARNING]
> Currently in Dev.

## Description

- The code _(shortened URL)_ is a 6 characters long "Alpha-Numeric" String made using **SHA256 Digest** of long URL and randomly selected characters from the digest.

- The shortened URL is stored in a dictionary with the code as the key and the  long URL as the value.

- The shortened URL is then returned to the user.

- When the user enters the shortened URL, the code is extracted from the URL and the long URL is fetched from the dictionary and user is then redirected to the long URL.

## Requirements

- Node.Js

## Quick Start

### Ports

- FrontEnd `5500`
- BackEnd `3000`

### Steps

Run the following commands

```bash
# FrontEnd
cd ./FrontEnd
npm install
npm run dev
```

```bash
# BackEnd
cd ./BackEnd
npm install
npm run dev
```

The frontend should be running on [http://localhost:3000](http://localhost:5500).

The backend should be running on [http://localhost:5000](http://localhost:3000). (Not to be accessed via browser)

## TODOs

- [ ] Add not found page (Frontend).

- [ ] Design the Front End.

- [x] Add a Database to store the shortened URLs.

- [ ] Add a "Copy to Clipboard" button.

- [ ] Host it. _Maybe, Maybe, Maybe...!_ 🤷🏻‍♂️

## Author

[ucx15 on GitHub](https://github.com/ucx15)

[Mail Me](mailto:inboxofuc@gmail.com)
