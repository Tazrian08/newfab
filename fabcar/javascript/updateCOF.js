/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');


async function main( params ) {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabcar');
        const nid = params.nid
        const key = params.key
        const cof=params.cof


        const users = [
            { NID: '1', role: 'admin' },
            { NID: '2', role: 'admin' },
            { NID: '3', role: 'admin' },
            // other users
          ];

          function isAdmin(userNID) {
            const user = users.find(u => u.NID === userNID);
            return user && user.role === 'admin';
          }

          if (!isAdmin(nid)) {
            throw new Error('Only admins can update the company reputation');
        }
          

  
        // const type = params.type
        // const count = params.count
        // const country = params.country
        const queryResult =  await contract.evaluateTransaction('queryCar', `${ key}`);
        console.log(`QUERY Transaction has been evaluated, result is: ${queryResult.toString()}`)

        const data=JSON.parse(queryResult.toString());


        const rep=data.reputation
        

        if (rep!="poor"){

        throw new Error('Reputation not poor');

        }


        await contract.submitTransaction('updateCOF', `${ key }`, `${cof}`)
        console.log('Change Owner Transaction has been submitted');







        // Submit the specified transaction.
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
        // await contract.submitTransaction('updateCOF', `${ key }`, `${cof}`)
        // console.log('Change Owner Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } 
     catch (error) {
        console.error(`Failed to change owner transaction: ${error.message}`);
        return Promise.reject(error);
    }
}

// main();
module.exports = { main }
