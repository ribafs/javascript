document.addEventListener('DOMContentLoaded', () => {

	// Elements
	const header = document.querySelector('.codeplayer__nav');
	const playerContainers = Array.from(document.querySelectorAll('.codeplayer__player'));
	const playerToggles = Array.from(document.querySelectorAll('.codeplayer__toggle'));
	const windowHeight = window.innerHeight;
	const headerHeight = header.clientHeight;
	const runButton = document.querySelector('#runButton');
	const iframe = document.querySelector('.codeplayer__results-frame');

	// Update iframe upon clicking the run button
	runButton.addEventListener('click', () => {
		let cssCode = document.querySelector('#cssCode').value;
		let jsCode = document.querySelector('#jsCode').value;
		let htmlCode = document.querySelector('#htmlCode').value;
		let result = `<style>${cssCode}</style>${htmlCode}<script>${jsCode}</script>`;
		let doc;

		if (iframe.contentDocument) {
			doc = iframe.contentDocument;
		} else if (iframe.contentWindow) {
			doc = iframe.contentWindow.document;
		}
		else {
			doc = iframe.document;
		}

		doc.open();
		doc.writeln(result);
		doc.close();
	});

	playerContainers.forEach(container => {
		container.addEventListener('keyup', (e) => {
			if (e.shiftKey && e.key == "Enter") {
				runButton.click();
				e.preventDefault();
			}
		})
	});
});