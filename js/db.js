import { getAuth } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js'
import { getFirestore, collection, query, where, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js'
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js'
import firebaseConfig from '../js/init-firebase.js'

const newDoc = document.getElementById('createNewDoc');
let userId = '';
const docBook = document.getElementById('documents');
let holdDoc = [];
const searchForm = document.getElementById('searchForm');
const search = document.getElementById('search');
localStorage.clear();
const app = initializeApp(firebaseConfig);
const Auth = getAuth();
const firestore = getFirestore(app)


function myFunction() {
	document.getElementById('myDropdown').classList.toggle('show');
}


window.onclick = function (event) {
	if (!event.target.matches('.dropbtn')) {
		var dropdowns = document.getElementsByClassName('dropdown-content');
		var i;
		for (i = 0; i < dropdowns.length; i++) {
			var openDropdown = dropdowns[i];
			if (openDropdown.classList.contains('show')) {
				openDropdown.classList.remove('show');
			}
		}
	}
};


Auth.onAuthStateChanged(function (user) {
	if (user) {
		userId = user.uid;
		getDocuments(userId);
	} else {
		console.log(user + '' + 'logged out');
	}
});



function showDoc() {
	docBook.innerHTML = null;
	for (let i = 0; i < holdDoc.length; i++) {
		let date = new Date(holdDoc[i].updated.toMillis());
		let hour = date.getHours();
		let sec = date.getSeconds();
		let minutes = date.getMinutes();
		var ampm = hour >= 12 ? 'pm' : 'am';
		hour = hour % 12;
		hour = hour ? hour : 12;
		var strTime = hour + ':' + minutes + ':' + sec + ' ' + ampm;

		let subString = holdDoc[i].content.replace(/^(.{14}[^\s]*).*/, '$1');

		docBook.innerHTML += `
			<div class="section group">
				<div class="col span_1_of_3">
					<p><a id="${holdDoc[i].id}" onclick="localStorage.setItem('token', id); window.location.href = '../editor.html';">
						<i class="fa fa-book"></i> ${subString}  <i class="fa fa-users"></i>
					</a></p>
				</div>
				<div class="col span_1_of_3">
					<p>${holdDoc[i].name}</p>
				</div>
				<div class="col span_1_of_3">
					<div class="dropdown">
							<p> ${strTime} <i class="fa fa-ellipsis-v dropbtn" onclick="myFunction"></i></p>
							<div id="myDropdown" class="dropdown-content">
								<a href="#" target="_blank" >Delete Doc</a>
								<a href="#">Open in New Tab</a>
							</div>
						</div>
				</div>
			</div>
			 `;
	}
}


function getDocuments(id) {
	const q = query(collection(firestore, 'docs', id, 'documents'));
	const unsubscribe = onSnapshot(q, (querySnapshot) => {
		querySnapshot.forEach((doc) => {
			let dcus = doc.data();
			dcus.id = doc.id;
			holdDoc.push(dcus);
			showDoc();
		});
	});
}





function searchDoc(content) {
	let db = firestore.collection('docs').doc(`${userId}`)
		.collection('documents')
		.where('name', '==', content);
	db.get()
		.then(function (querySnapshot) {
			querySnapshot.forEach(function (doc) {
				holdDoc = [];
				holdDoc.push(doc.data());
				showDoc();
			});
		})
		.catch(function (error) {
			console.log('Error getting documents: ', error);
		});
}

searchForm.addEventListener('submit', (e) => {
	e.preventDefault();
	searchDoc(search.value);
});


newDoc.addEventListener('click', e => {
	e.preventDefault();
	window.location.href = '../editor.html';
});