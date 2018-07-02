import {Injectable} from '@angular/core';
import {Constants} from './common/constants';

// const ecdsaSig = require('byteballcore/signature.js');
import * as ecdsaSig from 'byteballcore/signature.js';

// const breadcrumbs = require('byteballcore/breadcrumbs.js');
import * as breadcrumbs from 'byteballcore/breadcrumbs.js';

// const constants = require('byteballcore/constants.js');
import * as constants from 'byteballcore/constants.js';
import {Utils} from '../../../../_base/utils';
import {Credentials} from './credentials';


const isTestnet = constants.version.match(/t$/);
constants.DAGCOIN_ASSET = isTestnet ? 'B9dw3C3gMC+AODL/XqWjFh9jFe31jS08yf2C3zl8XGg=' : 'j5brqzPhQ0H2VNYi3i59PmlV15p54yAiSzacrQ2KqQQ=';
const lodash = require('lodash');
const $ = require('preconditions').singleton();
const util = require('util');
const events = require('events');
const Bitcore = require('bitcore-lib');

const log = require('./log');

const Errors = require('./errors/error.definitions');

@Injectable()
export class APIs {

  verbose: any;
  timeout: number;
  credentials: any;
  privateKeyEncryptionOpts = {
    iter: 10000,
  };

  constructor() {
    const opts: any = null;
    const options = opts || {};
    this.verbose = !!options.verbose;
    this.timeout = options.timeout || 50000;
    // walletDefinedByKeys = require('byteballcore/wallet_defined_by_keys.js');

    if (this.verbose) {
      log.setLevel('debug');
    } else {
      log.setLevel('info');
    }
  }

  initialize(opts): Promise<any> {
    return new Promise<any>(function (resolve, reject) {
      try {
        $.checkState(this.credentials);
        resolve(this.credentials);
      } catch (e) {
        reject(e);
      }
    });
  }

  seedFromMnemonic(words, opts) {
    $.checkArgument(lodash.isUndefined(opts) || lodash.isObject(opts), 'DEPRECATED: second argument should be an options object.');
    const options = opts || {};
    this.credentials = Credentials.fromMnemonic(options.network || 'livenet',
      words,
      options.passphrase,
      options.account || 0,
      options.derivationStrategy || Constants.DERIVATION_STRATEGIES.BIP44);
  }


  /**
   * Seed from extended private key
   *
   * @param {String} xPrivKey
   */
  seedFromExtendedPrivateKey(xPrivKey, account) {
    this.credentials = Credentials.fromExtendedPrivateKey(xPrivKey, account);
  }

  seedFromExtendedPublicKey(xPubKey, source, entropySourceHex, opts) {
    $.checkArgument(lodash.isUndefined(opts) || lodash.isObject(opts));
    const options = opts || {};
    this.credentials = Credentials.fromExtendedPublicKey(xPubKey,
      source,
      entropySourceHex,
      options.account || 0,
      options.derivationStrategy || Constants.DERIVATION_STRATEGIES.BIP44);
  }

  /**
   * Seed from random with mnemonic
   *
   * @param {Object} opts
   * @param {String} opts.network - default 'livenet'
   * @param {String} opts.passphrase
   * @param {Number} opts.language - default 'en'
   * @param {Number} opts.account - default 0
   */
  seedFromRandomWithMnemonic(opts) {
    $.checkArgument(arguments.length <= 1, 'DEPRECATED: only 1 argument accepted.');
    $.checkArgument(lodash.isUndefined(opts) || lodash.isObject(opts), 'DEPRECATED: argument should be an options object.');
    const options = opts || {};
    Utils.debug(`client: seedFromRandomWithMnemonic ${JSON.stringify(opts)}`);
    this.credentials = Credentials.createWithMnemonic(options.network || 'livenet',
      options.passphrase,
      options.language || 'en',
      options.account || 0);
  }

}

// util.inherits(APIs, events.EventEmitter);

