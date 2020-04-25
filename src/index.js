const bgColor = Pickr.create({
	el: '#bg-color-picker',
	theme: 'nano',
	default: '#1C1C1C',
	comparison: true,
	components: {
		preview: true,
		hue: true,
		interaction: {
			input: true,
			save: true
		}
	},
	strings: {
		save: 'Salvar'
	}
});

const textColor = Pickr.create({
	el: '#text-color-picker',
	theme: 'nano',
	default: '#FFFFFF',
	comparison: true,
	components: {
		preview: true,
		hue: true,
		interaction: {
			input: true,
			save: true
		}
	},
	strings: {
		save: 'Salvar'
	}
});

$('.app-add').click(() => {
	$('.app-add').before(appModel);
});

$('.apps').on('click', '.app-delete', function () {
	$(this).parent().parent().parent().remove();
});

$('.app-done').click(() => {
	$('.apps').addClass('was-validated');

	let valid = true;
	$('.apps input').each(function () {
		if ($(this).is(':invalid')) {
			valid = false;
		}
	});

	if (valid) makeStartPage();
});

$('.apps').on('change', '.app-picture', function (e) {
	var fileName = e.target.files[0] ? e.target.files[0].name : 'Imagem...';
	$(this).next('.custom-file-label').html(fileName);
});

function makeStartPage() {
	let zip = new JSZip();
	let apps = []
	let i = 0;

	$('.app-item').each(function () {
		let app = {}
		app.name = $(this).find('.app-name').val();
		app.url = $(this).find('.app-url').val();
		let file = $(this).find('.app-picture')[0].files[0];
		let iconName = file.name.split('.');
		let iconExtension = iconName[iconName.length - 1];
		app.icon = `icons/${i}.${iconExtension}`;
		apps.push(app);

		zip.file(`icons/${i++}.${iconExtension}`, file);
	});

	let appsGen = `var apps = ${JSON.stringify(apps)}`;
	let bg = bgColor.getColor().toHEXA().toString();
	let tcolor = textColor.getColor().toHEXA().toString();

	zip.file('index.html', generateHTML(appsGen, bg, tcolor));
	zip.generateAsync({ type: 'blob' })
		.then(content => {
			let url = window.URL.createObjectURL(content);
			$('.download').attr({ 'href': url, 'download': 'sites-launcher.zip' }).removeClass('hidden');

			var dlink = document.createElement('a');
			document.body.appendChild(dlink);
			dlink.style = 'display: none';
			dlink.href = url;
			dlink.download = 'sites-launcher.zip';
			dlink.click();
		});
}