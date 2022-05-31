$('.app-add').click(() => {
	$('.app-add').before(appModel)
})

$('.apps').on('click', '.app-delete', function () {
	$(this).parent().parent().parent().remove()
})

$('.app-done').click(() => {
	$('.apps').addClass('was-validated')

	let valid = true
	$('.apps input').each(function () {
		if ($(this).is(':invalid')) {
			valid = false
		}
	})

	if (valid) makeStartPage()
})

$('.apps').on('change', '.app-picture', function (e) {
	var fileName = e.target.files[0] ? e.target.files[0].name : 'Imagem...'
	$(this).next('.custom-file-label').html(fileName)
})

function makeStartPage() {
	let zip = new JSZip()
	let apps = []
	let i = 0

	$('.app-item').each(function () {
		let app = {}
		app.name = $(this).find('.app-name').val()
		app.url = $(this).find('.app-url').val()
		const file = $(this).find('.app-picture')[0].files[0]
		const iconName = file.name.split('.')
		const iconExtension = iconName[iconName.length - 1]
		app.icon = `icons/${i}.${iconExtension}`
		apps.push(app)

		zip.file(`icons/${i++}.${iconExtension}`, file)
	})

	const appsGen = `var apps = ${JSON.stringify(apps)}`
	const bg = $('#bgColor').val()
	const tcolor = $('#textColor').val()

	zip.file('index.html', generateHTML(appsGen, bg, tcolor))
	zip.generateAsync({ type: 'blob' })
		.then(content => {
			const url = window.URL.createObjectURL(content)
			$('.download').attr({ 'href': url, 'download': 'browser-startpage.zip' }).removeClass('hidden')

			let dlink = document.createElement('a')
			document.body.appendChild(dlink)
			dlink.style = 'display: none'
			dlink.href = url
			dlink.download = 'browser-startpage.zip'
			dlink.click()
		})
}