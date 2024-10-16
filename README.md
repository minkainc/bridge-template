# Bridge Template Project

This project was created from a template provided by Minka. It provides basic functionalities required to connect an existing financial system to a Minka Ledger instance.

Minka Ledger uses a protocol called the two phase commit to synchronize financial operations between multiple participants in real time. The protocol is implemented by exposing debits and credits API endpoints by the participants. Bridge is a name for services which provides these endpoints in order to connect or bridge financial networks using a common protocol. This is a starter project for implementing such a bridge.

To make it easier to get started, the template uses two SDKs provides by Minka: ledger-sdk and bridge-sdk. By using these SDKs we can avoid re-implementing a lot of the complexity which is common for every integration. For example: handling retries, asynchronous job processing, storing received data for auditability and analytics, etc.

The only thing a participant needs to provide is integration code required to interact with its internal systems. The simplest integration requires us to implement two adapters, one for credits and one for debits.

The project also allows to build on top of what is provided by adding additional functionalities since the project code is open-sourced.

## Ledger SDK

Ledger SDK is used to communicate with ledger. Ledger exposes all of its functionalities as REST APIs, so it can be used without any SDKs, but using the SDK makes it easier to interact with ledger.

Additionally, ledger security model is based on digital signatures. Ledger SDK also provides functionalities to create keys, sign requests and verify incoming requests. Everything related to digital signatures also uses well known algorithms, so it can be implemented without an SDK as well.

## Bridge SDK

Bridge SDK provides additional functionalities in order to create robust integration on the side of participants. Bridge SDK exposes standard two phase commit protocol API endpoints, stores all received data in a database, handles idempotency and retries.

The primary purpose of the bridge SDK is to provide best practices and common patterns for integrations to ledger. Most of these are technical challenges which can be implemented in a generic way. Bridge SDK provides these generic solutions to avoid re-implementing them for each integration.

## Core SDK

The project also contains a directory called `core-sdk`. This directory contains a simple example of a financial system to demonstrate how to integrate an external financial system with ledger. Any code from this directory can safely be removed. Real solutions will most probably replace this implementation with their own SDK or reference an existing SDK library instead.

## Starting up

Run all commands from the root project directory.

```shell
# Docker
$ npm run db:start

# Service
$ npm start
```

Alternatively use the minka CLI to setup a tunnel and handle bridge registration on ledger:
```
$ minka bridge start
```

## Shutting down

After pressing Ctrl+C to stop the service, run the following command to stop the docker container.

```shell
$ npm run db:stop
```

Minka CLI will shutdown the docker containers automatically, there is no need to do anything additionally after stopping the service.
