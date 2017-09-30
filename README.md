# ![SQ RPC Explorer](public/img/logo/logo-64.png) SQ RPC Explorer

Simple, stateless StatusQuo blockchain explorer, via RPC. Built with Node.js, express, bootstrap-v4.

This tool is intended to be a simple, stateless, self-hosted explorer for the statusquo blockchain, driven by RPC calls to your own statusquod node. Because it is stateless, it is easy to run but lacks some (many?) of the features of other explorers.

# Features

* List of recent blocks
* Browse blocks by height, in ascending or descending order
* View block details
* View transaction details, with navigation backward via spent outputs
* View raw JSON output used to generate most pages

# Getting started

## Prerequisites

1. Install and run a full, archiving node - [instructions](https://statusquo.cash). Ensure that your node has full transaction indexing enabled (`txindex=1`) and the RPC server enabled (`server=1`).
2. Synchronize your node with the statusquo network.

## Instructions

1. Clone this repo
2. `npm install` to install all required dependencies
3. Optional: Uncomment the "statusquod" section in [env.js](app/env.js) to automatically connect to the target node.
4. `npm start` to start the local server
5. Navigate to http://127.0.0.1:3002/
6. Connect using the RPC credentials for your target statusquo node (if you didn't edit [env.js](app/env.js) in Step 3)

# Screenshots

### Connect via RPC
# ![Connect](public/img/screenshots/connect.png)

### Homepage (list of recent blocks)
# ![Connect](public/img/screenshots/home.png)

### Block Details
# ![Connect](public/img/screenshots/block.png)

### Transaction Details
# ![Connect](public/img/screenshots/transaction.png)

### Transaction, Raw JSON
# ![Connect](public/img/screenshots/transaction-raw.png)

### List of Blocks by height (in ascending order)
# ![Connect](public/img/screenshots/blocks.png)
