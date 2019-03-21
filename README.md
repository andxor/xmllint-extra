xmllint-extra
=============

Decorate xmllint error messages with extra information (tag name and offset).

example
-------

When parsing with direct `xmllint` you could get:

```Javascript
{ errors:
  [
    "file_0.xml:2: element FatturaElettronica: Schemas validity error : Element '{http://ivaservizi.agenziaentrate.gov.it/docs/xsd/fatture/v1.2}FatturaElettronica', attribute 'versione': [facet 'enumeration'] The value '1.1' is not an element of the set {'FPA12', 'FPR12'}.",
    "file_0.xml:10: element FormatoTrasmissione: Schemas validity error : Element 'FormatoTrasmissione': [facet 'enumeration'] The value 'SDI11' is not an element of the set {'FPA12', 'FPR12'}.",
    "file_0.xml:10: element FormatoTrasmissione: Schemas validity error : Element 'FormatoTrasmissione': 'SDI11' is not a valid value of the atomic type '{http://ivaservizi.agenziaentrate.gov.it/docs/xsd/fatture/v1.2}FormatoTrasmissioneType'.",
    "file_0.xml:101: element PrezzoUnitario: Schemas validity error : Element 'PrezzoUnitario': '2459.020a' is not a valid value of the atomic type '{http://ivaservizi.agenziaentrate.gov.it/docs/xsd/fatture/v1.2}Amount8DecimalType'."
  ]
}
```

using this package that will be converted to:

```Javascript
{ errors:
  [
    { message: "Element '{http://ivaservizi.agenziaentrate.gov.it/docs/xsd/fatture/v1.2}FatturaElettronica', attribute 'versione': [facet enumeration'] The value '1.1' is not an element of the set {'FPA12', 'FPR12'}.",
      offset: 39,
      element: 'FatturaElettronica',
      context: '<ns3:FatturaElettronica xmlns:ns3="http://ivaservizi.agenziaentrate.gov.it/docs/xsd/fatture/v1.2" mlns:ns2="http://www.w3.org/2000/09/xmldsig#" versione="1.1">' },
    { message: "Element 'FormatoTrasmissione': [facet 'enumeration'] The value 'SDI11' is not an element of the set {'FPA12', 'FPR12'}.",
      offset: 425,
      element: 'FormatoTrasmissione',
      context: '<FormatoTrasmissione>SDI11</FormatoTrasmissione>' },
    { message: "Element 'FormatoTrasmissione': 'SDI11' is not a valid value of the atomic type 'http://ivaservizi.agenziaentrate.gov.it/docs/xsd/fatture/v1.2}FormatoTrasmissioneType'.",
      offset: 425,
      element: 'FormatoTrasmissione',
      context: '<FormatoTrasmissione>SDI11</FormatoTrasmissione>' },
    { message: "Element 'PrezzoUnitario': '2459.020a' is not a valid value of the atomic type 'http://ivaservizi.agenziaentrate.gov.it/docs/xsd/fatture/v1.2}Amount8DecimalType'.",
      offset: 3760,
      element: 'PrezzoUnitario',
      context: '<PrezzoUnitario>2459.020a</PrezzoUnitario>' }
  ]
}
```
