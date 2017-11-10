var fs = require('fs'),
    opn = require('opn'),
    readline = require('readline');

//define function that writes an array to a file from the specified path
function writeToFile(array, path) {
    var file = fs.createWriteStream(path);
    file.on('error', function (err) {
        if (err) {
            console.log(err);
        }
    });
    array.forEach(function (e, i) {
        file.write(e + '\n');
    });
    file.end();
}

fs.readFile(process.argv[2], 'utf8', function (err, data) {
    if (err) {
        console.error(err);
    }

    var searchRegex = /.+\.seniorvu\.com/ig;
    var dataArray = data.split('\n');
    var links = dataArray.filter(function (v, i) {
        return v.match(searchRegex);
    }).map(function (v, i) {
        return v.trim();
    });

    console.log(links);

    //log the array
    links.map(function (e, i) {
        console.log('#' + i + '  -  ' + e);
    });

    //write all the subdomains to file
    writeToFile(links, 'subdomainOutput.txt');

    //prepend https:// to the links
    //write the new links to file
    var httpsLinks = links.map(function (e, i) {
        return 'https://' + e;
    });
    writeToFile(httpsLinks, 'httpsLinksOutput.txt');

    //open all the subdomains in admin/domains search page
    //bulks of 5 using cli
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Open the ADMIN links? ', function (answer) {
        if (answer === 'y') {
            links.forEach(function (e, i) {
                opn('https://app.instapage.com/admin/domain?search=' + e, {
                    app: 'google chrome'
                }, false);
            });
        } else {
            return;
        }
        rl.close();
    });

    /*rl.question('Open the LIVE links? ', function (answer) {
        if (answer === 'y') {
            httpsLinks.forEach(function (e, i) {
                opn(e, {
                    app: 'google chrome'
                }, false);
            });
        } else {
            return;
        }
        rl.close();
    }, false);*/
});
