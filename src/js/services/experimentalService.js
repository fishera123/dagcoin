/* eslint-disable import/no-unresolved */
(function () {
  'use strict';

  angular.module('copayApp.services').factory('experimentalService', (profileService) => {
    const root = {};

    root.experiment = () => {
      // Feel free to experiment
      console.log('TODO: DO SOMETHING IN THIS EXPERIMENT');

      const fc = profileService.focusedClient;
      const signer = root.getSigner(fc.credentials.xPrivKey);

      const db = require('byteballcore/db.js');
      db.query(
        'SELECT address ' +
        'FROM my_addresses ' +
        'WHERE is_change = 0 ' +
        'AND address_index = 0 ' +
        'AND wallet = ?',
        [fc.credentials.walletId],
        (rows) => {
          if (!rows || rows.length === 0) {
            console.log(`NO ADDRESSES FOR is_change = 0, address_index = 0 AND wallet = ${fc.credentials.walletId}`);
            return;
          }

          console.log(JSON.stringify(rows));
          const masterAddress = rows[0].address;

          console.log(`FOUND AND ADDRESSES FOR is_change = 0, address_index = 0 AND wallet = ${fc.credentials.walletId}: ${masterAddress}`);

          signer.proof('hello', masterAddress).then((proof) => {
            console.log(proof);
          });
        }
      );
    };

    root.getSigner = (pvtKey) => {
      function Signer(xPrivateKey) {
        this.xPrivateKey = xPrivateKey;

        this.constants = require('byteballcore/constants.js');
        this.objectHash = require('byteballcore/object_hash.js');
        this.ecdsaSig = require('byteballcore/signature.js');
        this.db = require('byteballcore/db');
        this.device = require('byteballcore/device');
        this.eventBus = require('byteballcore/event_bus');
        this.walletGeneral = require('byteballcore/wallet_general');
        this.async = require('async');
      }

      Signer.prototype.signWithLocalPrivateKey = function (walletId, account, isChange, addressIndex, textToSign, handleSig) {
        const Bitcore = require('bitcore-lib');
        const path = `m/44'/0'/${account}'/${isChange}/${addressIndex}`;
        const privateKey = new Bitcore.HDPrivateKey.fromString(this.xPrivateKey).derive(path).privateKey;
        const privKeyBuf = privateKey.bn.toBuffer({ size: 32 }); // https://github.com/bitpay/bitcore-lib/issues/47
        handleSig(this.ecdsaSig.sign(textToSign, privKeyBuf));
      };

      Signer.prototype.readSigningPaths = function (conn, address, handleLengthsBySigningPaths) {
        const self = this;

        const arrSigningDeviceAddresses = [self.device.getMyDeviceAddress()];

        this.readFullSigningPaths(conn, address, arrSigningDeviceAddresses, (assocTypesBySigningPaths) => {
          const assocLengthsBySigningPaths = {};

          Object.keys(assocTypesBySigningPaths).forEach((key) => {
            const type = assocTypesBySigningPaths[key];
            if (type === 'key') {
              assocLengthsBySigningPaths[key] = self.constants.SIG_LENGTH;
            } else {
              throw Error(`unknown type ${type} at ${key}`);
            }
          });

          handleLengthsBySigningPaths(assocLengthsBySigningPaths);
        });
      };

      Signer.prototype.readDefinition = function (conn, address, handleDefinition) {
        conn.query('SELECT definition FROM my_addresses WHERE address=?', [address], (rows) => {
          if (rows.length !== 1) {
            throw Error('definition not found');
          }
          handleDefinition(null, JSON.parse(rows[0].definition));
        });
      };

      Signer.prototype.proof = function (textToProve, address) {
        console.log('BEFORE DEFINING VARIABLES');
        const self = this;

        const crypto = require('crypto');
        const bufToSign = crypto.createHash('sha256').update(textToProve, 'utf8').digest(); // self.objectHash.getUnitHashToSign(textToProve);
        const signingPath = 'r';

        console.log('SO FAR SO GOOD');

        return new Promise((resolve, reject) => {
          self.findAddress(address, signingPath, {
            ifError: (err) => {
              reject(err);
            },
            ifUnknownAddress: (err) => {
              reject(`UNKNOWN ADDRESS ${address} AT ${signingPath}: ${err}`);
            },
            ifLocal: (objAddress) => {
              self.signWithLocalPrivateKey(objAddress.wallet, objAddress.account, objAddress.is_change, objAddress.address_index, bufToSign, (sig) => {
                resolve(sig);
              });
            },
            ifRemote: () => {
              reject('NO REMOTE ALLOWED FOR PROOFING');
            },
            ifMerkle: () => {
              reject('NO MERKLE ALLOWED FOR PROOFING');
            }
          });
        });
      };

      Signer.prototype.sign = function (objUnsignedUnit, assocPrivatePayloads, address, signingPath, handleSignature) {
        const self = this;

        const bufToSign = self.objectHash.getUnitHashToSign(objUnsignedUnit);

        self.findAddress(address, signingPath, {
          ifError: (err) => {
            throw Error(err);
          },
          ifUnknownAddress: (err) => {
            throw Error(`unknown address ${address} at ${signingPath}: ${err}`);
          },
          ifLocal: (objAddress) => {
            self.signWithLocalPrivateKey(objAddress.wallet, objAddress.account, objAddress.is_change, objAddress.address_index, bufToSign, (sig) => {
              handleSignature(null, sig);
            });
          },
          ifRemote: (deviceAddress) => {
            // we'll receive this event after the peer signs
            self.eventBus.once(`signature-${deviceAddress}-${address}-${signingPath}-${bufToSign.toString('base64')}`, (sig) => {
              handleSignature(null, sig);
              if (sig === '[refused]') {
                self.eventBus.emit('refused_to_sign', deviceAddress);
              }
            });
            self.walletGeneral.sendOfferToSign(deviceAddress, address, signingPath, objUnsignedUnit, assocPrivatePayloads);
            // TODO: support this
            /* if (!bRequestedConfirmation) {
              self.eventBus.emit("confirm_on_other_devices");
            } */
          },
          ifMerkle: (bLocal) => {
            if (!bLocal) {
              throw Error(`merkle proof at path ${signingPath} should be provided by another device`);
            }
            // TODO: support this
            /* if (!merkle_proof) {
              throw Error("merkle proof at path " + signingPath + " not provided");
            }
            handleSignature(null, merkle_proof); */
          }
        });
      };

// returns assoc array signing_path => (key|merkle)
      Signer.prototype.readFullSigningPaths = function (conn, address, arrSigningDeviceAddresses, handleSigningPaths) {
        const self = this;

        const assocSigningPaths = {};

        function goDeeper(memberAddress, pathPrefix, onDone) {
          console.log(`SIGNING MEMBER: ${memberAddress}: ${pathPrefix}`);

          // first, look for wallet addresses
          let sql = 'SELECT signing_path FROM my_addresses JOIN wallet_signing_paths USING(wallet) WHERE address=?';

          let arrParams = [memberAddress];
          if (arrSigningDeviceAddresses && arrSigningDeviceAddresses.length > 0) {
            sql += ' AND device_address IN(?)';
            arrParams.push(arrSigningDeviceAddresses);
          }
          conn.query(sql, arrParams, (myAddresses) => {
            myAddresses.forEach((row) => {
              assocSigningPaths[pathPrefix + row.signing_path.substr(1)] = 'key';
            });
            if (myAddresses.length > 0) {
              return onDone();
            }
            // next, look for shared addresses, and search from there recursively
            sql = 'SELECT signing_path, address FROM shared_address_signing_paths WHERE shared_address=?';
            arrParams = [memberAddress];
            if (arrSigningDeviceAddresses && arrSigningDeviceAddresses.length > 0) {
              sql += ' AND device_address IN(?)';
              arrParams.push(arrSigningDeviceAddresses);
            }
            conn.query(sql, arrParams, (sharedAddresses) => {
              if (sharedAddresses.length > 0) {
                self.async.eachSeries(
                  sharedAddresses,
                  (row, cb) => {
                    if (row.address === '') { // merkle
                      assocSigningPaths[pathPrefix + row.signing_path.substr(1)] = 'merkle';
                      return cb();
                    }

                    goDeeper(row.address, pathPrefix + row.signing_path.substr(1), cb);
                  },
                  onDone
                );
              } else {
                assocSigningPaths[pathPrefix] = 'key';
                onDone();
              }
            });
          });
        }

        goDeeper(address, 'r', () => {
          console.log(`SIGNING PATHS: ${JSON.stringify(assocSigningPaths)}`);
          handleSigningPaths(assocSigningPaths); // order of signing paths is not significant
        });
      };

      Signer.prototype.findAddress = function (address, signingPath, callbacks, fallbackRemoteDeviceAddress) {
        const self = this;

        console.log('BEFORE QUERY');

        self.db.query(
          'SELECT wallet, account, is_change, address_index, full_approval_date, device_address ' +
          'FROM my_addresses JOIN wallets USING(wallet) JOIN wallet_signing_paths USING(wallet) ' +
          'WHERE address=? AND signing_path=?',
          [address, signingPath],
          (rows) => {
            if (!rows || rows === 0) {
              throw Error(`ADDRESS ${address} NOT FOUND WITH SIGNING PATH ${signingPath}`);
            }

            if (rows.length > 1) {
              throw Error('more than 1 address found');
            }
            if (rows.length === 1) {
              const row = rows[0];
              if (!row.full_approval_date) {
                return callbacks.ifError(`wallet of address ${address} not approved`);
              }

              if (row.device_address !== self.device.getMyDeviceAddress()) {
                return callbacks.ifRemote(row.device_address);
              }

              const objAddress = {
                address,
                wallet: row.wallet,
                account: row.account,
                is_change: row.is_change,
                address_index: row.address_index
              };
              console.log('BEFORE CALLBACK');
              callbacks.ifLocal(objAddress);
              return;
            }
            self.db.query(
              // look for a prefix of the requested signing_path
              'SELECT address, device_address, signing_path FROM shared_address_signing_paths ' +
              'WHERE shared_address=? AND signing_path=SUBSTR(?, 1, LENGTH(signing_path))',
              [address, signingPath],
              (sharedAddresses) => {
                if (rows.length > 1) {
                  throw Error(`more than 1 member address found for shared address ${address} and signing path ${signingPath}`);
                }

                if (sharedAddresses.length === 0) {
                  if (fallbackRemoteDeviceAddress) {
                    return callbacks.ifRemote(fallbackRemoteDeviceAddress);
                  }
                  return callbacks.ifUnknownAddress();
                }
                const objSharedAddress = sharedAddresses[0];
                const relativeSigningPath = `r${signingPath.substr(objSharedAddress.signing_path.length)}`;
                const bLocal = (objSharedAddress.device_address === self.device.getMyDeviceAddress()); // local keys
                if (objSharedAddress.address === '') {
                  return callbacks.ifMerkle(bLocal);
                }
                self.findAddress(objSharedAddress.address, relativeSigningPath, callbacks, bLocal ? null : objSharedAddress.device_address);
              }
            );
          }
        );
      };

      /**
       /**
       * Verifies an hash signed with a private key
       * @param hash Some hash to be compared
       * @param b64sig The hash signature (generated using a private key PrK)
       * @param b64pubKey The public key corresponding to PrK
       *
       * Returns true if the verification succeeded.
       */
      Signer.prototype.verify = function (hash, b64sig, b64pubKey) {
        return this.ecdsaSig.verify(hash, b64sig, b64pubKey);
      };

      return new Signer(pvtKey);
    };

    return root;
  });
}());
