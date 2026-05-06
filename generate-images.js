/**
 * Genera derivados WebP/AVIF (-480w / -800w) y WebP a tamaño original para fondos en main.css.
 * Uso: node generate-images.js [--force]
 */
'use strict';

var fs = require('fs');
var path = require('path');
var sharp = require('sharp');

var ROOT = __dirname;
var IMAGES_DIR = path.join(ROOT, 'assets', 'images');
var MAIN_CSS = path.join(ROOT, 'assets', 'css', 'main.css');

var WIDTHS = [480, 800];
var WEBP_Q = 82;
var AVIF_Q = 65;

var force = process.argv.indexOf('--force') !== -1;

function logSize(label, bufLen) {
    console.log('  ' + label + ': ' + bufLen + ' bytes');
}

function isDerivativeBase(base) {
    return /-480w$/.test(base) || /-800w$/.test(base);
}

function collectRasterInputs() {
    var names = fs.readdirSync(IMAGES_DIR);
    var out = [];
    var extRe = /\.(jpe?g|png|webp)$/i;
    for (var i = 0; i < names.length; i++) {
        var n = names[i];
        if (!extRe.test(n)) continue;
        var base = path.basename(n, path.extname(n));
        if (isDerivativeBase(base)) continue;
        out.push(path.join(IMAGES_DIR, n));
    }
    return out;
}

function extractBackgroundPngFiles(cssText) {
    var files = [];
    var re = /\.bg-[a-zA-Z0-9_-]+\s*\{[^}]*background-image:\s*url\(['"]?(?:assets\/images|\.\.\/images)\/([^'")]+)['"]?\)/g;
    var m;
    while ((m = re.exec(cssText)) !== null) {
        var f = m[1];
        if (/\.png$/i.test(f) && files.indexOf(f) === -1) {
            files.push(f);
        }
    }
    return files;
}

function ensureDirExists(filePath) {
    var dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function formatBytes(n) {
    if (n >= 1048576) return (n / 1048576).toFixed(2) + ' MB';
    if (n >= 1024) return (n / 1024).toFixed(1) + ' KB';
    return n + ' B';
}

function processRaster(inputPath) {
    var ext = path.extname(inputPath).toLowerCase();
    var base = path.basename(inputPath, ext);
    var stem = base;

    fs.accessSync(inputPath, fs.constants.R_OK);
    var originalBuf = fs.readFileSync(inputPath);
    var originalMeta = sharp(originalBuf).metadata();
    return originalMeta.then(function (meta) {
        console.log('\n[' + path.basename(inputPath) + '] original ' + formatBytes(originalBuf.length) + (meta.width ? ', ' + meta.width + '×' + meta.height : ''));

        var tasks = [];

        for (var w = 0; w < WIDTHS.length; w++) {
            var width = WIDTHS[w];
            (function (width) {
                var webpOut = path.join(IMAGES_DIR, stem + '-' + width + 'w.webp');
                var avifOut = path.join(IMAGES_DIR, stem + '-' + width + 'w.avif');

                tasks.push(
                    (force || !fs.existsSync(webpOut)
                        ? sharp(originalBuf)
                              .resize({ width: width, withoutEnlargement: true })
                              .webp({ quality: WEBP_Q })
                              .toBuffer()
                              .then(function (buf) {
                                  ensureDirExists(webpOut);
                                  fs.writeFileSync(webpOut, buf);
                                  logSize(stem + '-' + width + 'w.webp', buf.length);
                              })
                        : Promise.resolve().then(function () {
                              console.log('  skip (exists): ' + path.basename(webpOut));
                          }))
                );

                tasks.push(
                    (force || !fs.existsSync(avifOut)
                        ? sharp(originalBuf)
                              .resize({ width: width, withoutEnlargement: true })
                              .avif({ quality: AVIF_Q })
                              .toBuffer()
                              .then(function (buf) {
                                  ensureDirExists(avifOut);
                                  fs.writeFileSync(avifOut, buf);
                                  logSize(stem + '-' + width + 'w.avif', buf.length);
                              })
                        : Promise.resolve().then(function () {
                              console.log('  skip (exists): ' + path.basename(avifOut));
                          }))
                );
            })(width);
        }

        return Promise.all(tasks);
    });
}

function processBackgroundPng(pngRelative) {
    var inputPath = path.join(IMAGES_DIR, path.basename(pngRelative));
    if (!fs.existsSync(inputPath)) {
        console.warn('Background source missing: ' + inputPath);
        return Promise.resolve();
    }
    var stem = path.basename(pngRelative, path.extname(pngRelative));
    var webpOut = path.join(IMAGES_DIR, stem + '.webp');

    var originalBuf = fs.readFileSync(inputPath);
    console.log('\n[BG ' + path.basename(inputPath) + '] original ' + formatBytes(originalBuf.length));

    if (!force && fs.existsSync(webpOut)) {
        console.log('  skip (exists): ' + path.basename(webpOut));
        return Promise.resolve();
    }

    return sharp(originalBuf)
        .webp({ quality: WEBP_Q })
        .toBuffer()
        .then(function (buf) {
            fs.writeFileSync(webpOut, buf);
            logSize(stem + '.webp (full)', buf.length);
        });
}

function main() {
    var cssText = fs.readFileSync(MAIN_CSS, 'utf8');
    var bgPngs = extractBackgroundPngFiles(cssText);

    var inputs = collectRasterInputs();
    var chain = Promise.resolve();

    for (var b = 0; b < bgPngs.length; b++) {
        (function (rel) {
            chain = chain.then(function () {
                return processBackgroundPng(rel);
            });
        })(bgPngs[b]);
    }

    for (var i = 0; i < inputs.length; i++) {
        (function (p) {
            chain = chain.then(function () {
                return processRaster(p);
            });
        })(inputs[i]);
    }

    chain
        .then(function () {
            console.log('\nDone.');
        })
        .catch(function (err) {
            console.error(err);
            process.exit(1);
        });
}

main();
