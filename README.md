# Monad Auto-Compounder (Omnichain)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI/CD Status](https://github.com/credkellar-boop/MONAD-AUTO-COMPOUND/actions/workflows/main.yml/badge.svg)](https://github.com/credkellar-boop/MONAD-AUTO-COMPOUND/actions/workflows/main.yml)
[![GitHub issues](https://img.shields.io/github/issues/credkellar-boop/MONAD-AUTO-COMPOUND.svg)](https://github.com/credkellar-boop/MONAD-AUTO-COMPOUND/issues)
[![GitHub forks](https://img.shields.io/github/forks/credkellar-boop/MONAD-AUTO-COMPOUND.svg?style=social&label=Fork)](https://github.com/credkellar-boop/MONAD-AUTO-COMPOUND/network)
[![GitHub stars](https://img.shields.io/github/stars/credkellar-boop/MONAD-AUTO-COMPOUND.svg?style=social&label=Star)](https://github.com/credkellar-boop/MONAD-AUTO-COMPOUND/stargazers)

An automated staking and compounding service designed for the Monad network, with extensible architecture to support cross-chain compounding across multiple platforms.

## Setup

1. Clone the repository.
2. Run `npm install` in both `/backend` and `/frontend` directories.
3. Configure your `.env` and `config.json` files in the backend.
4. Start the backend: `node src/index.js`
5. Start the frontend: `npm start` (set timer for when to compound, like for example compound every .30 cents)
