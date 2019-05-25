/**
 * Rhythmus plugin deployment script
 * https://showit.co
 * with help from archiver README.md :)
 */

const fs			= require('fs');
const archiver		= require('archiver');

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
const filesToZip = ["./rhythmus.php",
    "./AppPageTemplate.php",
    "./includes/Rhythmus.php",
    "./includes/class-rhythmus-install.php",
    "./includes/Endpoint/KRAReview.php",
    "./includes/Endpoint/Teammate.php",
    "./includes/Endpoint/Weeklyreport.php",
    "./app/public/index.html",
]
const dirsToZip = ["./app/build/"]

/** string: name of .zip file for upload
 *	currently create the zip file in the current directory of this script
 *	to change that, adjust the outputFileName to include target directory
 */
const outputFileName = __dirname + "/rhythmus.zip";

const archive = archiver('zip', {
    zlib: { level: 9 }  // sets high compression level
});

// open the stream for the file we are writing to
var output = fs.createWriteStream(outputFileName);
// let the user know we are creating the zip file and providing the name
console.log("Creating Zip File:", outputFileName);

output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('Archive File Successfully Created.');
});

output.on('end', function () {
    console.log('Data has been drained');
});

archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
        console.log('WARNING: ', err.code);
    } else {
        throw err;
    }
});

archive.on('error', function (err) {
    throw err;
});

// now we pipe the data into our output filestream
archive.pipe(output)

// add all of the files from filesToZip to our archive.
filesToZip.forEach(function (value) {
    archive.file(value);
});
// add all of the directories from dirsToZip to our archive
dirsToZip.forEach(function (value) {
    archive.directory(value)
});

// added all our files, time to do the zipping!
archive.finalize();