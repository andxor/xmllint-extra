/*!
 * node xmllint-names
 * (c) 2019 Lapo Luchini <l.luchini@andxor.it>
 */
'use strict';

const
    lint = require('xmllint'),
    reTag = /<[^/?]/g,
    reLine = /\r?\n/g,
    reErr = /^file_0.xml:([0-9]+): /,
    reOff = /^<!--offset:([0-9]+)-->/;

function oneTagPerLine(xml) {
    // return xml.replace(reTag, '\n$&');
    return xml.replace(reTag, (match, offset) => '\n<!--offset:' + offset + '-->' + match);
}

function validateXML(opts) {
    const opt2 = Object.assign({}, opts);
    opt2.xml = oneTagPerLine(opt2.xml);
    console.log(opt2.xml);
    const err = lint.validateXML(opt2);
    if (err.errors) {
        const lines = opt2.xml.split(reLine);
        err.errors = err.errors.map(s => {
            const
                msg = reErr.exec(s),
                line = lines[msg[1] - 1],
                off = reOff.exec(line);
            return {
                message: s.slice(msg[0].length),
                offset: +off[1],
                context: line.slice(off[0].length)
            }
        });
    }
    return err;
}

module.exports = { validateXML };
