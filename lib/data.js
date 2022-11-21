/*
 *
 *
 ->Title: datahandling
 ->Description: handling all data [CRUD] operation
 ->Author: Shawon Talukder
 ->Date: 11/09/2022
 *
 *
 */

// dependencies
const fs = require('fs');
const path = require('path');

// model scaffolding
const lib = {};

// structure

// base directory for data folder where file will be saved
lib.basedir = path.join(__dirname, '/../.data');

// Create operation - write data to file
lib.create = (dir, fileName, data, callback) => {
    fs.open(`${lib.basedir}/${dir}/${fileName}.json`, 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // convert data into string
            const stringData = JSON.stringify(data);
            // write the file
            fs.writeFile(fileDescriptor, stringData, (error) => {
                if (!error) {
                    // close the file after writing
                    fs.close(fileDescriptor, (error3) => {
                        if (!error3) {
                            callback(false);
                        } else {
                            callback('error occured while closing the file');
                        }
                    });
                } else {
                    callback('There is a error writing the file');
                }
            });
        } else {
            callback('There is an error creating file or file exists');
        }
    });
};

// Read operation - reading an existing file
lib.read = (dir, fileName, callback) => {
    // open the file to read
    fs.readFile(`${lib.basedir}/${dir}/${fileName}.json`, 'utf8', (err, data) => {
        callback(err, data);
    });
};

// Update Operation - updating the existing file
lib.update = (dir, fileName, updatedData, callback) => {
    // file open for updating
    fs.open(`${lib.basedir}/${dir}/${fileName}.json`, 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            const stringData = JSON.stringify(updatedData);

            // truncate the file
            fs.ftruncate(fileDescriptor, (error) => {
                if (!error && fileDescriptor) {
                    fs.writeFile(fileDescriptor, stringData, (error3) => {
                        if (!error3) {
                            callback(false);
                        } else {
                            callback('error while writing the updated value in the file.');
                        }
                    });
                } else {
                    callback('Error truncating the file');
                }
            });
        } else {
            callback('There is an error opening the file. File may not exists');
        }
    });
};

// Delete Operation - deleting an existing file
lib.delete = (dir, fileName, callback) => {
    // unlink the file
    fs.unlink(`${lib.basedir}/${dir}/${fileName}.json`, (err) => {
        if (err) callback(err);
        callback(false);
    });
};

// library to pass all filename from a directory
lib.list = (dir, callback) => {
    fs.readdir(`${lib.basedir}/${dir}`, (err1, checks) => {
        if (!err1 && checks && checks.length > 0) {
            const trimmedChecks = [];
            checks.forEach((check) => {
                trimmedChecks.push(check.replace('.json', ''));
            });
            callback(false, trimmedChecks);
        } else {
            callback('Error: The directory may be empty');
        }
    });
};
// export
module.exports = lib;
