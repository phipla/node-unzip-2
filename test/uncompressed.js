'use strict';

var test = require('tap').test;
var fs = require('fs');
var path = require('path');
var temp = require('temp');
var dirdiff = require('dirdiff');
var unzip = require('../');

test("parse uncompressed archive", function (t) {
  var archive = path.join(__dirname, '../testData/uncompressed/archive.zip');

  var unzipParser = unzip.Parse();
  fs.createReadStream(archive).pipe(unzipParser);
  unzipParser.on('error', function(err) {
    throw err;
  });

  unzipParser.on('close', t.end.bind(this));
});

test("extract uncompressed archive", function (t) {
  var archive = path.join(__dirname, '../testData/uncompressed/archive.zip');

  temp.mkdir('node-unzip-', function (err, dirPath) {
    if (err) {
      throw err;
    }
    var unzipExtractor = unzip.Extract({ path: dirPath });
    unzipExtractor.on('error', function(err) {
      throw err;
    });
    unzipExtractor.on('close', testExtractionResults);

    fs.createReadStream(archive).pipe(unzipExtractor);

    function testExtractionResults() {
      dirdiff(path.join(__dirname, '../testData/uncompressed/inflated'), dirPath, {
        fileContents: true
      }, function (err, diffs) {
        if (err) {
          throw err;
        }
        t.equal(diffs.length, 0, 'extracted directory contents');
        t.end();
      });
    }
  });
});

test("parse really uncompressed archive", function (t) {
    var archive = path.join(__dirname, '../testData/uncompressed/lorem.zip');

    var unzipParser = unzip.Parse();
    fs.createReadStream(archive).pipe(unzipParser);
    unzipParser.on('error', function(err) {
        throw err;
    });

    unzipParser.on('close', t.end.bind(this));
});

test("extract really uncompressed archive", function (t) {
    var archive = path.join(__dirname, '../testData/uncompressed/lorem.zip');

    temp.mkdir('node-unzip-', function (err, dirPath) {
        if (err) {
            throw err;
        }
        console.log(dirPath);
        var unzipExtractor = unzip.Extract({ path: dirPath });
        unzipExtractor.on('error', function(err) {
            throw err;
        });
        unzipExtractor.on('close', testExtractionResults);

        fs.createReadStream(archive).pipe(unzipExtractor);

        function testExtractionResults() {
            dirdiff(path.join(__dirname, '../testData/uncompressed/lorem_unziped'), dirPath, {
                fileContents: true
            }, function (err, diffs) {
                if (err) {
                    throw err;
                }
                t.equal(diffs.length, 0, 'extracted directory contents');
                t.end();
            });
        }
    });
});