/**
 * Rhythmus plugin deployment script
 * https://showit.co
 * with help from archiver README.md :)
 */


/**
 * Quick check to see if the following are true:
 * if const fs fails, then they haven't brought it in, we err out
 * then we can check for node_module directory and make sure that the stuff we need is there
 * if it isn't, we can err out
 * if it is, we run node build
 * then zip and done.
*/
const fs = require('fs');
const { spawn } = require('child_process');

const projectName = "rhythmus";
const node_moduleDir = "./app/node_modules";
const buildDir = "./app/build"

if (!fs.existsSync(node_moduleDir)) {
    console.log(node_moduleDir + " doesn't exist, please run `npm install` in the ./app directory.");
    process.exit(1)
} else {
    console.log(node_moduleDir + " exists, checking for " + buildDir + "...")
    if (!fs.existsSync(buildDir)) {
        console.log(buildDir + " doesn't exist, please run `npm run build` in the ./app directory.")
        process.exit(1);
    } else {
        console.log(buildDir + " exists, so we are good to zip")
    }
}


var archiver;
try{
    archiver = require('./app/node_modules/archiver');
}catch(e) {
    console.log("Error trying to use archiver, please make sure you have installed archiver");
    console.log("In the ./app directory, run: `npm install archiver`.");
    process.exit(1);
}

/* Files I think we want to zip up are:
 *	./rhythmus.php
 *	./AppPageTemplate.php
 *	./includes/Rhythmus.php
 *	./includes/class-rhythmus-install.php
 *	./includes/Endpoint/KRAReview.php
 *	./includes/Endpoint/Teammate.php
 *	./includes/Endpoint/Weeklyreport.php
 *	./app/public/index.html
 *	./app/build/
 */
const filesToZip = [
    "./autoload.php",
    "./rhythmus.php",
    "./AppPageTemplate.php",
    "./app/public/index.html",
];
const dirsToZip = ["./app/build/**", "./includes/**"];
const dirsToExclude = ["./sample-data/**"];

/** string: name of .zip file for upload
 *	currently create the zip file in the current directory of this script
 *	to change that, adjust the outputFileName to include target directory
 */
const outputFileName = __dirname + "/" + projectName + ".zip";

const archive = archiver('zip', {
    zlib: { level: 9 }  // sets high compression level
});

// open the stream for the file we are zipping to
var output = fs.createWriteStream(outputFileName);

// let the user know we are creating the zip file and providing the name
console.log("Creating Zip File:", outputFileName);

// let the user know we successfully zipped the file and the script is done
output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log(projectName + ' Plugin Zipfile Successfully Created.');
});

output.on('end', function () {
    console.log('Data has been drained');
});
// if its just a warning, maybe we can continue...
archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
        console.log('WARNING: ', err.code);
    } else {
        throw err;
    }
});
// uh-oh!
archive.on('error', function (err) {
    throw err;
});

// pipe the data into our output filestream
archive.pipe(output)

// add all of the files from filesToZip to our archive.
filesToZip.forEach(function (value) {
    archive.file(value);
});

// add all of the directories from dirsToZip to our archive
dirsToZip.forEach(function (value) {
    archive.glob(value, { ignore: dirsToExclude });
});

// added all our files, time to do the zipping!
archive.finalize();