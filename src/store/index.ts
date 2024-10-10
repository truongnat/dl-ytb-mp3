import Store from 'electron-store';


const electron_store = new Store();

electron_store.set('unicorn', '🦄');
console.log(electron_store.get('unicorn'));
//=> '🦄'

// Use dot-notation to access nested properties
electron_store.set('foo.bar', true);
console.log(electron_store.get('foo'));
//=> {bar: true}

electron_store.delete('unicorn');
console.log(electron_store.get('unicorn'));
//=> undefined