import { Injectable } from '@angular/core';
import * as _ from 'lodash';


@Injectable()
export class FileStorageService {

  fileSystem;
  directory;

  constructor() { }


  init(cb) {
    if (this.directory) {
      return cb(null, this.fileSystem, this.directory);
    }

    function onFileSystemSuccess(fs) {
      console.log('File system started: ', fs.name, fs.root.name);
      this.fileSystem = fs;
      this.getDir((err, newDir) => {
        if (err || !newDir.nativeURL) {
          return cb(err);
        }
        this.directory = newDir;
        // $log.debug('Got main dir:', directory.nativeURL);
        return cb(null, this.fileSystem, this.directory);
      });
    }

    function fail(evt) {
      const msg = `Could not init file system: ${evt.target.error.code}`;
      console.log(msg);
      return cb(msg);
    }

    // return window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, fail);
  }

  get = function (k, cb) {
    this.init((err, fs, dir) => {
      if (err) {
        return cb(err);
      }
      return dir.getFile(k, {
        create: false,
      }, (fileEntry) => {
        if (!fileEntry) {
          return cb();
        }
        return fileEntry.file((file) => {
          const reader = new FileReader();

          reader.onloadend = function () {
            return cb(null, this.result);
          };

          reader.readAsText(file);
        });
      }, (error) => {
        // Not found
        if (error.code === 1) {
          return cb();
        }
        return cb(error);
      });
    });
  };

  set = function (k, v, cb) {
    this.init((err, fs, dir) => {
      if (err) {
        return cb(err);
      }
      return dir.getFile(k, {
        create: true,
      }, (fileEntry) => {
        // Create a FileWriter object for our FileEntry (log.txt).
        fileEntry.createWriter((fileWriter) => {
          fileWriter.onwriteend = function () {
            console.log('Write completed.');
            return cb();
          };

          fileWriter.onerror = function (e) {
            const error = e.error ? e.error : JSON.stringify(e);
            console.log(`Write failed: ${error}`);
            return cb(`Fail to write:${error}`);
          };
          let val = v;
          if (_.isObject(val)) {
            val = JSON.stringify(val);
          }

          if (!_.isString(val)) {
            val = val.toString();
          }

          // $log.debug('Writing:', k, val);
          fileWriter.write(val);
        }, cb);
      }, cb);
    });
  };

  remove = function (k, cb) {
    this.init((err, fs, dir) => {
      if (err) {
        return cb(err);
      }
      return dir.getFile(k, {
        create: false,
      }, (fileEntry) => {
        // Create a FileWriter object for our FileEntry (log.txt).
        fileEntry.remove(() => {
          console.log('File removed.');
          return cb();
        }, cb);
      }, cb);
    });
  };

  /**
   * Same as setItem, but fails if an item already exists
   */
  create = function (name, value, callback) {
    this.get(name,
      (err, data) => {
        if (data) {
          return callback('EXISTS');
        }
        return this.set(name, value, callback);
      });
  };

}
