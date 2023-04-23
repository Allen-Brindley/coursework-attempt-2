const dbName = 'recipeDatabase';
const dbVersion = 1;

const openDB = () => {
  const openRequest = window.indexedDB.open(dbName, dbVersion);
  openRequest.onerror = function(event) {
    console.error('Error opening database:', event.target.errorCode);
  };
  openRequest.onsuccess = function(event) {
    const db = event.target.result;
    console.log('Database opened successfully:', dbName);
    
    const transaction = db.transaction('recipes', 'readwrite');
    const objectStore = transaction.objectStore('recipes');
  
    objectStore.add({ cuisine: 'Japanese', name: 'Sushi Rolls' });
    objectStore.add({ cuisine: 'Thai', name: 'Tom Yum Soup' });
    objectStore.add({ cuisine: 'Korean', name: 'Bibimbap' });
    objectStore.add({ cuisine: 'Thai', name: 'Pad See Ew' });
    objectStore.add({ cuisine: 'Japanese', name: 'Okonomiyaki' });
    objectStore.add({ cuisine: 'Japanese', name: 'Yakitori' });
    objectStore.add({ cuisine: 'Korean', name: 'Bibim Naengmyeon' });
    objectStore.add({ cuisine: 'Korean', name: 'Japchae' });
    objectStore.add({ cuisine: 'Korean', name: 'Kimchi Jjigae' });
    objectStore.add({ cuisine: 'Chinese', name: 'Kung Pao Chicken' });
  
    transaction.oncomplete = function() {
      console.log('Transaction completed: data added to object store');
      
      const tx = db.transaction('recipes', 'readonly');
      const objectStore = tx.objectStore('recipes');
      const recipes = objectStore.getAll();
      recipes.onsuccess = function() {
        const recipeList = recipes.result.filter((recipe) => recipe.cuisine === cuisine).map((recipe) => recipe.name);
        console.log('Recipes retrieved:', recipeList);
      };
      tx.oncomplete = function() {
        console.log('Transaction completed: data retrieved from object store');
      };
      tx.onerror = function(event) {
        console.error('Transaction error: ' + event.target.errorCode);
      };
    };
    transaction.onerror = function(event) {
      console.error('Transaction error: ' + event.target.errorCode);
    };
  };
  
  openRequest.onupgradeneeded = function(event) {
    const db = event.target.result;
    const objectStore = db.createObjectStore('recipes', { keyPath: 'id', autoIncrement: true });
    objectStore.createIndex('cuisine', 'cuisine', { unique: false });
    console.log('Database upgraded successfully:', dbName);
  };
  
  return openRequest;
};

export const getRecipeByCuisine = async (cuisine) => {
  return new Promise((resolve, reject) => {
    const openRequest = openDB();
    openRequest.onsuccess = function(event) {
      const db = event.target.result;
      const tx = db.transaction('recipes', 'readonly');
      const objectStore = tx.objectStore('recipes');
      const recipes = objectStore.getAll();
      recipes.onsuccess = function() {
        const recipeList = recipes.result.filter((recipe) => recipe.cuisine === cuisine).map((recipe) => recipe.name);
        resolve(recipeList);
      };
      tx.oncomplete = function() {
        console.log('Transaction completed: data retrieved from object store');
      };
      tx.onerror = function(event) {
        console.error('Transaction error: ' + event.target.errorCode);
        reject(event.target.errorCode);
      };
    };
  });
};

