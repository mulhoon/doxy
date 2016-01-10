# Doxy
*Modern, mobile friendly web directories.*


<img src="doxy.png"/>

## Installation
1. Copy *[doxy.html](dist/doxy.html)* to your server
2. Add this to the end of your root *.htaccess*

```
IndexOptions IgnoreCase FancyIndexing FoldersFirst VersionSort
IndexOptions SuppressHTMLPreamble SuppressDescription SuppressIcon  
HeaderName /doxy.html
```
