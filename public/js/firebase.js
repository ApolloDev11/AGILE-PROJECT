let firebaseReadyCallback = () => null;
const firebaseReady = new Promise(resolve => firebaseReadyCallback = resolve);

let firebaseReadyState = 0;
function updateFirebaseReadyState() {
	firebaseReadyState++;
	if(firebaseReadyState == 3) firebaseReadyCallback(true);
}

function importModuleScope(module) {
	for(let key in module) window[key] = module[key];
}

import("https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js").then(module => {
	importModuleScope(module);
	updateFirebaseReadyState();
});

import("https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js").then(module => {
	importModuleScope(module);
	updateFirebaseReadyState();
});

import("https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js").then(module => {
	importModuleScope(module);
	updateFirebaseReadyState();
});

const FIREBASE_CONFIG = {
	apiKey: "AIzaSyAkoYvz49Xs6vg9-SUHM236plfeN6Dck4s",
	authDomain: "mtu-group-project-agile.firebaseapp.com",
	databaseURL: "ttps://mtu-group-project-agile-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "mtu-group-project-agile",
	storageBucket: "mtu-group-project-agile.appspot.com",
	messagingSenderId: "120193305147",
	appId: "1:120193305147:web:2d3030b6e662d54a67aa1e"
}

let app, auth, database;
firebaseReady.then(() => {
	app = initializeApp(FIREBASE_CONFIG);
	auth = getAuth(app);
	database = getDatabase(app);
})