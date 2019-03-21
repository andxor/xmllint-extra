/*!
 * node xmllint-extra
 * (c) 2019 Lapo Luchini <l.luchini@andxor.it>
 */
'use strict';

const
    lint = require('xmllint'),
    reTag = /<[^/?]/g,
    reLine = /\r?\n/g,
    reErr = /^file_0.xml:([0-9]+): element ([^:]+): Schemas validity error : /,
    reOff = /^<!--offset:([0-9]+)-->/;

function oneTagPerLine(xml) {
    return xml.replace(reTag, (match, offset) => '\n<!--offset:' + offset + '-->' + match);
}

function validateXML(opts) {
    const opt2 = Object.assign({}, opts);
    opt2.xml = oneTagPerLine(opt2.xml);
    const out = lint.validateXML(opt2);
    if (out.errors) {
        const lines = opt2.xml.split(reLine);
        out.errors = out.errors.map(s => {
            try {
                const
                    msg = reErr.exec(s),
                    line = lines[msg[1] - 1],
                    offset = reOff.exec(line);
                return {
                    message: s.slice(msg[0].length),
                    offset: +offset[1],
                    element: msg[2],
                    context: line.slice(offset[0].length)
                }
            } catch (e) {
                return { message: s };
            }
        });
    }
    return out;
}

module.exports = { validateXML };
