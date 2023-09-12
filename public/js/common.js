if ($.fn.validate) {
	$('form[novalidate]').validate({
		ignore: ':hidden:not(.do-not-ignore)',
		submitHandler: function (form) {
			form.submit();
		}
	});
}