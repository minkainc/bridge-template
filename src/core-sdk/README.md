# Demo Transactional System SDK

This directory contains a demo of a transactional system SDK to show more easily how an integration with an existing financial system could look like. The code in this directory is intended only for demonstration purposes and should never be used in production. You can safely delete all the code from this directory and replace it with an implementation that connects to your internal systems.

## Ledger

A simple in-memory implementation of a bank ledger which is used to track balances. The ledger has several accounts already preconfigured to simplify testing. These are:
```
1001001001 -> has transactions, balance: 1000,00 USD
1001001002 -> no transactions,  balance:    0,00 USD
1001001003 -> has transactions, balance:    0,00 USD
1001001004 -> inactive account, balance:   80,00 USD
```

You can add more accounts and change anything you want in this directory to allow you to test more easily.

## Account

Represents a single bank account. This class has common operations that can be performed on an account.

Primary balance movements are represented as debits and credits. Debits are used to subtract an amount from an account balance, while credits are used to add an amount to an account balance.

Accounts also have statuses to simulate blocked or frozen accounts. Currently supported statuses are only `active` or `inactive`.

## Transaction

Transactions represent balance movements. They are data objects containing all the information required to define a single balance movement between two accounts.

## Errors

Errors contain classes which define basic errors that can happen in a financial system. The error are defined here to demonstrate how to handle and map errors between an external system and ledger.
