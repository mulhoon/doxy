# Make a theme

To compile doxy yourself (and make themes)

1. clone this repo
2. run ```$ npm install```
3. run ```$ gulp```

Gulp automatically watches and compiles changes.

Each ```.scss``` file found in ```source/scss/themes/``` automatically creates a ```.html``` file of the same name in ```dist/```. This is your compiled version of doxy. 

Start by duplicating one of the scss themes and editing it. Then point ```.htaccess``` to the compiled html file.
