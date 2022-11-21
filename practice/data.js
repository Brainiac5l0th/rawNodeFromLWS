// dependencies
const fs = require('fs');
const path = require('path');

// model scaffolding
const lib = {};

// structure
lib.basedir = path.join(__dirname, '/./.data');

// create
lib.create = (dir, fileName, data, callback) => {
    // open the file to check if it exists or not
    fs.open(`${lib.basedir}/${dir}/${fileName}.json`, 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            const strData = JSON.stringify(data);
            // write file
            fs.writeFile(fileDescriptor, strData, (err2) => {
                if (!err2 && fileDescriptor) {
                    // close the file
                    fs.close(fileDescriptor, (err3) => {
                        if (!err3) callback(false);
                        else callback('There is an error writing the file.');
                    });
                } else {
                    callback('error writing the file. please check');
                }
            });
        } else {
            callback('there is an error opening the file. It may Already exists');
        }
    });
};

// read
lib.read = (dir, fileName, callback) => {
    fs.readFile(`${lib.basedir}/${dir}/${fileName}.json`, 'utf8', (err, data) => {
        callback(err, data);
    });
};

// update
lib.update = (dir, fileName, upData, callback) => {
    fs.open(`${lib.basedir}/${dir}/${fileName}.json`, 'r+', (err, fileDescriptor) => {
        if (!err) {
            // trucate the file
            fs.ftruncate(fileDescriptor, (err2) => {
                if (!err2) {
                    const strData = JSON.stringify(upData);
                    fs.writeFile(fileDescriptor, strData, (err3) => {
                        if (!err3) {
                            callback(false);
                        } else {
                            callback('error writing the file');
                        }
                    });
                } else {
                    callback('error truncating the file');
                }
            });
        } else {
            callback('error opening the file');
        }
    });
};

// delete
lib.delete = (dir, fileName, callback) => {
    fs.unlink(`${lib.basedir}/${dir}/${fileName}.json`, (err) => {
        if (!err) callback(false);
        else callback('there is an error deleting the file');
    });
};

// export
module.exports = lib;
