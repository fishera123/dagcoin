/* eslint-disable import/no-unresolved */
(function () {
  'use strict';

  angular.module('copayApp.services').factory('experimentalService', (profileService) => {
    const root = {};

    root.experiment = () => {
      // Feel free to experiment
      console.log('TODO: DO SOMETHING IN THIS EXPERIMENT');

      const fc = profileService.focusedClient;

      const walletId = fc.credentials.walletId;
      const xPrivKey = fc.credentials.xPrivKey;

      const signingPath = 'r';

      const textToProve = 'Hello';

      const db = require('byteballcore/db.js');

      return new Promise((resolve, reject) => {
        db.query(
          'SELECT address ' +
          'FROM my_addresses ' +
          'WHERE is_change = 0 ' +
          'AND address_index = 0 ' +
          'AND wallet = ?',
          [fc.credentials.walletId],
          (rows) => {
            if (!rows || rows.length === 0) {
              reject(`MASTER ADDRESS NOT FOUND FOR WALLET ${walletId}`);
            }

            if (rows.length > 1) {
              reject(`TOO MANY MASTER ADDRESSES FOR WALLET ${walletId}: ${rows.length}`);
            }

            resolve(rows[0].address);
          }
        );
      }).then((masterAddress) => {
        console.log(`MASTER ADDRESS FOUND: ${masterAddress}`);
        return new Promise((resolve, reject) => {
          db.query(
            'SELECT address, wallet, account, is_change, address_index, full_approval_date, device_address, definition ' +
            'FROM my_addresses JOIN wallets USING(wallet) JOIN wallet_signing_paths USING(wallet) ' +
            'WHERE address=? AND signing_path=?',
            [masterAddress, signingPath],
            (rows) => {
              if (!rows || rows.length === 0) {
                reject(`MASTER ADDRESS DEFINITION NOT FOUND FOR WALLET ${walletId} AND ADDRESS ${masterAddress}`);
              }

              if (rows.length > 1) {
                reject(`TOO MANY MASTER ADDRESS DEFINITION FOUND FOR WALLET ${walletId} AND ADDRESS ${masterAddress}: ${rows.length}`);
              }

              resolve(rows[0]);
            });
        });
      }).then((master) => {
        const Bitcore = require('bitcore-lib');
        const PrivateKey = require('bitcore-lib/lib/privatekey');
        const ecdsaSig = require('byteballcore/signature.js');

        const path = `m/44'/0'/${master.account}'/${master.is_change}/${master.address_index}`;
        const privateKey = new Bitcore.HDPrivateKey.fromString(xPrivKey).derive(path);
        const privKeyBuf = privateKey.privateKey.bn.toBuffer({ size: 32 }); // https://github.com/bitpay/bitcore-lib/issues/47

        if (!PrivateKey.isValid(privateKey.privateKey)) {
          const Networks = require('bitcore-lib/networks');
          const error = PrivateKey.getValidationError(fc.credentials.xPrivKey, Networks.defaultNetwork);
          if (error) {
            return Promise.reject(`INVALID PRIVATE KEY (${fc.credentials.xPrivKey}) : ${error}`);
          }
        }

        const crypto = require('crypto');
        const bufToSign = crypto.createHash('sha256').update(textToProve, 'utf8').digest();
        const sig = ecdsaSig.sign(bufToSign, privKeyBuf);

        try {
          const definition = JSON.parse(master.definition);

          if (!definition) {
            return Promise.reject(`NO DEFINITION FOUND FOR ${master.address}`);
          }

          if (definition.length !== 2) {
            return Promise.reject(`ONLY SIMPLE ADDRESSES ACCEPTED. CHECK THE DEFINITION OF ${master.address}`);
          }

          let publicKey = null;

          for (let i = 0; i < definition.length; i += 1) {
            if (definition[i] !== 'sig' && !definition[i].pubkey) {
              return Promise.reject(`ONLY SIMPLE ADDRESSES ACCEPTED. CHECK THE DEFINITION OF ${master.address}`);
            }

            if (definition[i].pubkey) {
              publicKey = definition[i].pubkey;
            }
          }

          const pubkey64 = new Buffer(publicKey, 'base64');

          const verified = ecdsaSig.verify(bufToSign, sig, pubkey64);

          console.log(`${verified ? 'VERIFIED' : 'NOT VERIFIED'}`);

          process.exit();
        } catch (e) {
          console.log(`EXCEPTION: ${e}`);
          process.exit();
        }
      });
    };

    return root;
  });
}());
