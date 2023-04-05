@calumk/node-red-node-adodb
====================

A Node-Red node to read and write a local adodb database.

Install
-------

Run the following command in your Node-RED user directory - typically `~/.node-red`

    npm i --unsafe-perm @calumk/node-red-node-adodb

**Notes**:

  - Version 1.x requires nodejs v12 or greater.
  - The install process requires a compile of native code. This can take 15-20 minutes on devices like a Raspberry Pi - please be prepared to wait a long time. Also if node.js is upgraded at any point you will need to rebuild the native part manually, for example.

    cd ~/.node-red
    npm rebuild

Usage
-----

Allows access to a Adodb database.
