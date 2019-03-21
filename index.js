/*!
 * node xmllint-extra
 * (c) 2019 Lapo Luchini <l.luchini@andxor.it>
 */
'use strict';

const
    lint = require('xmllint'),
    reLoc1 = /targetNamespace="([^"]+)"/,
    reLoc2 = /(\bimport\s+namespace="([^"]+)"\s+schemaLocation=")[^"]+/g,
    reTag = /<[^/?]/g,
    reLine = /\r?\n/g,
    reErr = /^file_0.xml:([0-9]+): element ([^:]+): Schemas validity error : /,
    reOff = /^<!--offset:([0-9]+)-->/;

function oneTagPerLine(xml) {
    return xml.replace(reTag, (match, offset) => '\n<!--offset:' + offset + '-->' + match);
}

function validateXML(opts) {
    if (typeof opts.xml != 'string')
        throw new Error('Option "xml" should be a string.');
    if (typeof opts.schema != 'object' || !Array.isArray(opts.schema))
        throw new Error('Option "schema" should be an array of strings.');
    const opt2 = Object.assign({}, opts);
    opt2.xml = oneTagPerLine(opt2.xml);
    opt2.schema = [];
    const loc = {};
    opts.schema.forEach(s => {
        // detect namespace defined by this schema
        const ns = reLoc1.exec(s);
        if (ns)
            loc[ns[1]] = 'file_' + opt2.schema.length + '.xsd';
        // redirect imports of a known schema to the right file
        s = s.replace(reLoc2, (all, base, ns) => {
            const file = loc[ns];
            if (!file) return;
            return base + file;
        });
        opt2.schema.push(s);
    });
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
