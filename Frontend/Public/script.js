const inputFieldDOM = document.querySelector('#input-url');
const btnSubmitDOM  = document.querySelector('#btn-submit');
const tinyUrlDOM    = document.querySelector('#tiny-url');


const BACKEND_URL = 'http://localhost:3000';
const db = []
let URL;


function updateCurrentURL() {
	const url = inputFieldDOM.value;
	if (url) {
		URL = url;
		return true;
	}
	return false;
}



async function fetchTinyURL() {

	if ( !updateCurrentURL() ) {
		console.error('No URL to fetch');
		return;
	}

	try {
		const resp = await fetch(`${BACKEND_URL}/gen`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({'url' : URL})
		})

		if (!resp.ok) {
			throw new Error('Failed to fetch');
		}
		else if (resp.status === 400) {
			throw new Error('URL is required');
		}

		data = await resp.json();
		return data.tiny_url;
	}

	catch(err) {
		console.error(err);
	}
}


async function displayTinyURL() {
	const data = await fetchTinyURL();
	tinyUrlDOM.innerHTML = `<a href="${data}">${data}</a>`;
}


btnSubmitDOM.addEventListener('click', () => {
	if( updateCurrentURL() ) {
		displayTinyURL(URL);
	}
});


inputFieldDOM.addEventListener('keydown', (event) => {
	if (event.key === "Enter" ) {

		event.preventDefault();

		if( updateCurrentURL() ) {
			displayTinyURL(URL);
		}

	}
});
