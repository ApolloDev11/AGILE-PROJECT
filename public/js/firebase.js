const firebaseModules = ["app", "auth", "database", "storage"];
const firebaseVersion = "10.14.1";

let firebaseReadyCallback = () => null;
const firebaseReady = new Promise(resolve => firebaseReadyCallback = resolve);

let firebaseReadyState = 0;
for(let moduleName of firebaseModules) {
	let url = `https://www.gstatic.com/firebasejs/${firebaseVersion}/firebase-${moduleName}.js`;
	import(url).then(module => {
		for(let key in module) {
			// Two firebase modules have the same key, "ref"
			let importKey = key;
			if(importKey == "ref" && moduleName == "storage") importKey = "storageRef";
			if(importKey in window) console.warn(`Encountered duplicate module key "${importKey}" when importing module "${moduleName}"`);
			window[importKey] = module[key];
		}
		firebaseReadyState++;
		if(firebaseReadyState == firebaseModules.length) firebaseReadyCallback(true);
	})
}

const FIREBASE_CONFIG = {
	apiKey: "AIzaSyAkoYvz49Xs6vg9-SUHM236plfeN6Dck4s",
	authDomain: "mtu-group-project-agile.firebaseapp.com",
	databaseURL: "https://mtu-group-project-agile-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "mtu-group-project-agile",
	storageBucket: "mtu-group-project-agile.appspot.com",
	messagingSenderId: "120193305147",
	appId: "1:120193305147:web:2d3030b6e662d54a67aa1e"
}

let app, auth, database, storage;
firebaseReady.then(() => {
	app = initializeApp(FIREBASE_CONFIG);
	auth = getAuth(app);
	database = getDatabase(app);
	storage = getStorage(app);
})