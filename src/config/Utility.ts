import {Data} from "./SessionData";
import {UserType} from "./Config";

export namespace Url {
	export function makeUrl(url: string, session: Data): string {
		if (session) {
			switch (session.userType) {
				case UserType.ADMIN:
					return '/admin'+ url;
				case UserType.PARTNER:
					return '/partner' + url;
				case UserType.USER:
					return '/user' + url;
			}
		} else {
			return '/';
		}
	}
}

export class Plugins {
	static makePageScript(js: string[] = [], css: string[] = []) {
		return {
			js: js,
			css: css
		};
	}

	static printArea = {
		css: [],
		js: ["/plugins/printArea/jquery.printArea.js"]
	};
	static Bkash = {
		css: [],
		js: ["https://unpkg.com/bkash/dist/bkash.min.js"]
	};

	static fileInput = {
		css: [],
		js: [
			"/plugins/fileinput/jasny-bootstrap.js"
		]
	};
	static perfectScrollbar = {
		css: [],
		js: [
			"/plugins/perfect-scrollbar/perfect-scrollbar.min.js"
		]
	};
	static slimScroll = {
		css: [],
		js: [
			"/plugins/slimScroll/jquery.slimscroll.js"
		]
	};
	static waves = {
		css: [],
		js: [
			"/plugins/waves/waves.js"
		]
	};
	static blockUI = {
		css: [],
		js: [
			"/plugins/blockUI/jquery.blockUI.js"
		]
	};

	static theme = {
		css: [],
		js: [
			"/js/theme.js"
		]
	};

	static bootstrapDatepicker = {
		css: [
			"/plugins/bootstrap-datepicker/bootstrap-datepicker.min.css"
		],
		js: [
			"/plugins/bootstrap-datepicker/bootstrap-datepicker.min.js"
		]
	};
	static bootstrapMaterialDatetimePicker = {
		css: [
			"/plugins/bootstrap-material-datetimepicker/css/bootstrap-material-datetimepicker.css"
		],
		js: [
			"/plugins/bootstrap-material-datetimepicker/js/bootstrap-material-datetimepicker.js"
		]
	};
	static bootstrapDateRangePicker = {
		css: [
			"/plugins/bootstrap-daterangepicker/daterangepicker.css"
		],
		js: [
			"/plugins/bootstrap-daterangepicker/daterangepicker.js"
		]
	};
	static bootstrapRTL = {
		css: [
			"/plugins/bootstrap-rtl-master/dist/css/bootstrap-rtl.min.css"
		],
		js: [
			"/plugins/bootstrap-rtl-master/dist/js/bootstrap-rtl.min.js"
		]
	};
	static bootstrapSelect = {
		css: [
			"/plugins/bootstrap-select/bootstrap-select.min.css"
		],
		js: [
			"/plugins/bootstrap-select/bootstrap-select.min.js"
		]
	};
	static bootstrapSwitch = {
		css: [
			"/plugins/bootstrap-switch/bootstrap-switch.css"
		],
		js: [
			"/plugins/bootstrap-switch/bootstrap-switch.js"
		]
	};
	static bootstrapSocial = {
		css: [
			"/plugins/bootstrap-social/bootstrap-social.css"
		],
		js: []
	};
	static bootstrapTable = {
		css: [
			"/plugins/bootstrap-table/bootstrap-table.css"
		],
		js: [
			"/plugins/bootstrap-table/bootstrap-table.min.js",
			"/plugins/bootstrap-table/bootstrap-table-locale-all.min.js",
			"/plugins/bootstrap-table/extensions/auto-refresh/bootstrap-table-auto-refresh.min.js",
			'/plugins/bootstrap-table/extensions/export/bootstrap-table-export.min.js',
			'/plugins/bootstrap-table/extensions/print/bootstrap-table-print.min.js',
			'/plugins/tableExport/tableExport.js',
			'/plugins/tableExport/libs/jsPDF/jspdf.min.js',
			'/plugins/tableExport/libs/jsPDF-AutoTable/jspdf.plugin.autotable.js'
		]
	};
	static bootstrapTagsInput = {
		css: [
			"/plugins/bootstrap-tagsinput/dist/bootstrap-tagsinput.css"
		],
		js: [
			"/plugins/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js"
		]
	};
	static bootstrapTouchSpin = {
		css: [
			"/plugins/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.css"
		],
		js: [
			"/plugins/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.js"
		]
	};
	static bootstrapTreeView = {
		css: [],
		js: [
			"/plugins/bootstrap-treeview-master/dist/bootstrap-treeview.min.js"
		]
	};

	static bsDateTimePicker = {
		css: [
			'/plugins/bsDateTimePicker/css/bootstrap-datetimepicker.min.css'
		],
		js: [
			"/plugins/bsDateTimePicker/js/bootstrap-datetimepicker.min.js"
		]
	};
	static c3 = {
		css: [
			"/plugins/c3-master/c3.min.css"
		],
		js: ["/plugins/c3-master/c3.min.js"
		]
	};
	static fullCalendar = {
		css: [
			"/plugins/calendar/dist/fullcalendar.min.css"
		],
		js: [
			"/plugins/calendar/jquery-ui.min.js",
			"/plugins/calendar/dist/fullcalendar.min.js",
			"/plugins/calendar/dist/jquery.fullcalendar.js"
		]
	};
	static chartJs = {
		css: [],
		js: [
			"/plugins/Chart.js/Chart.min.js"
		]
	};
	static chartistJs = {
		css: [
			"/plugins/chartist-js/chartist.min.css",
			"/plugins/chartist-js/chartist-legend.css"
		],
		js: ["/plugins/chartist-js/chartist.min.js",
			"/plugins/chartist-js/chartist-plugin-legend.js"
		]
	};
	static chartistPluginTooltip = {
		css: [
			"/plugins/chartist-plugin-tooltip-master/dist/chartist-plugin-tooltip.css"
		],
		js: ["/plugins/chartist-plugin-tooltip-master/dist/chartist-plugin-tooltip.min.js"
		]
	};
	static clockPicker = {
		css: [
			"/plugins/clockpicker/dist/jquery-clockpicker.min.css"
		],
		js: [
			"/plugins/clockpicker/dist/jquery-clockpicker.min.js"
		]
	};
	static colorPicker = {
		css: [
			"/plugins/colorpicker/dist/chartist-plugin-tooltip.css"
		],
		js: [
			"/plugins/colorpicker/dist/chartist-plugin-tooltip.min.js"
		]
	};
	static counterUp = {
		css: [],
		js: [
			"/plugins/counterup/jquery.counterup.min.js"
		]
	};
	static cropper = {
		css: [
			"/plugins/cropper/cropper.min.css"
		],
		js: [
			"/plugins/cropper/cropper.min.js"
		]
	};
	static cssChart = {
		css: [
			"/plugins/css-chart/css-chart.css"
		],
		js: []
	};
	static d3 = {
		css: [],
		js: [
			"/plugins/css-chart/css-chart.css"
		]
	};
	static customSelect = {
		css: [
			"/plugins/custom-select/custom-select.css"
		],
		js: [
			"/plugins/custom-select/custom-select.min.js"
		]
	};
	static dataTables = {
		css: [
			"/plugins/datatables/datatables.min.css",
			"/plugins/datatables/yadcf.css",
			'/plugins/jqueryui/jquery-ui.min.css'
		],
		js: [
			"/plugins/datatables/datatables.min.js",
			"/plugins/datatables/yadcf.js",
			"/plugins/jqueryui/jquery-ui.min.js"
		]
	};
	static datePaginator = {
		css: [
			"/plugins/date-paginator/bootstrap-datepaginator.min.css"
		],
		js: [
			"/plugins/date-paginator/bootstrap-datepaginator.min.js",
		]
	};
	static dateRangePicker = {
		css: [
			"/plugins/daterangepicker/daterangepicker.css"
		],
		js: [
			"/plugins/daterangepicker/daterangepicker.js",
		]
	};
	static moment = {
		css: [
		],
		js: [
			"/plugins/moment/min/moment.min.js",
		]
	};
	static datetimePicker = {
		css: [
			"/plugins/datetimepicker/jquery.datetimepicker.min.css"
		],
		js: [
			"/plugins/datetimepicker/jquery.datetimepicker.full.min.js",
		]
	};
	static dff = {
		css: [],
		js: [
			"/plugins/dff/dff.js"
		]
	};
	static dropify = {
		css: [
			"/plugins/dropify/css/dropify.min.css"
		],
		js: [
			"/plugins/dropify/js/dropify.js"
		]
	};
	static dropZone = {
		css: [
			"/plugins/dropzone/dropzone.min.css"
		],
		js: [
			"/plugins/dropzone/dropzone.min.js"
		]
	};
	static eCharts = {
		css: [],
		js: [
			"/plugins/echarts/echarts.js"
		]
	};
	static fancyBox = {
		css: [
			"/plugins/fancybox/ekko-lightbox.min.css"
		],
		js: [
			"/plugins/fancybox/ekko-lightbox.min.js"
		]
	};
	static fileUploader = {
		css: [
			"/plugins/fileuploader/fileinput.min.css"
		],
		js: [
			"/plugins/fileuploader/piexif.min.js",
			"/plugins/fileuploader/sortable.min.js",
			"/plugins/fileuploader/purify.min.js",
			"/plugins/fileuploader/fileinput.min.js",
			"/plugins/fileuploader/theme.min.js",
		]
	};
	static flot = {
		css: [],
		js: [
			"/plugins/flot/excanvas.min.js",
			"/plugins/flot/jquery.flot.js",
			"/plugins/flot/jquery.flot.pie.js",
			"/plugins/flot/jquery.flot.resize.js",
			"/plugins/flot/jquery.flot.time.js",
			"/plugins/flot/jquery.flot.stack.js",
			"/plugins/flot/jquery.flot.crosshair.js"
		]
	};
	static flotTooltip = {
		css: [],
		js: [
			"/plugins/flot.tooltip/js/jquery.flot.tooltip.min.js"
		]
	};
	static footable = {
		css: [
			"/plugins/footable/css/footable.Core.css"
		],
		js: [
			"/plugins/footable/js/footable.all.min.js"
		]
	};
	static formy = {
		css: [
			"/plugins/formy/formy.min.css"
		],
		js: [
			"/plugins/forrmy/formy.min.js"
		]
	};
	static gallery = {
		css: [
			"/plugins/gallery/css/animated-masonry-gallery.css"
		],
		js: [
			"/plugins/gallery/js/animated-masonry-gallery.js",
			"/plugins/gallery/js/jquery.isotope.min.js"
		]
	};
	static gauge = {
		css: [],
		js: [
			"/plugins/gauge/gauge.min.js",
		]
	};
	static gMaps = {
		css: [],
		js: [
			"/plugins/gmaps/gmaps.min.js",
			"/plugins/gmaps/jquery.gmaps.js"
		]
	};
	static girdStack = {
		css: [
			"/plugins/girdstack/girdstack.min.css"
			,
		],
		js: [
			"/plugins/girdstack/girdstack.min.js",
			"/plugins/girdstack/girdstack.jQueryUi.min.js"
		]
	};
	static holderJs = {
		css: [],
		js: [
			"/plugins/holderjs/holder.js",
		]
	};
	static horizontalTimeline = {
		css: [
			"/plugins/horizontal-timeline/css/horizontal-timeline.css"
		],
		js: [
			"/plugins/horizontal-timeline/js/horizontal-timeline.js"
		]
	};
	static html5Editor = {
		css: [
			"/plugins/html5-editor/bootstrap-wysihtml5.css"
		],
		js: [
			"/plugins/html5-editor/wysihtml5-0.3.0.js",
			"/plugins/html5-editor/bootstrap-wysihtml5.js"
		]
	};
	static iCheck = {
		css: [
			"/plugins/icheck/skins/all.css"
		],
		js: [
			"/plugins/icheck/icheck.min.js"
		]
	};
	static inputMask = {
		css: [],
		js: [
			"/plugins/inputmask/dist/jquery.inputmask.bundle.min.js"
		]
	};
	static ionRangeSlider = {
		css: [
			"/plugins/ion-rangeslider/css/ion.rangeSlider.css"
			,
			"/plugins/ion-rangeslider/css/ion.rangeSlider.skinModern.css"
		],
		js: [
			"/plugins/ion-rangeslider/js/ion-rangeSlider/ion.rangeSlider.min.js"
		]
	};
	static easyPieChart = {
		css: [],
		js: [
			"/plugins/jquery.easy-pie-chart/dist/jquery.easypiechart.min.js"
		]
	};
	static jqueryAsColor = {
		css: [],
		js: [
			"/plugins/jquery-asColor/dist/jquery-asColor.min.js"
		]
	};
	static jqueryAsColorPicker = {
		css: [
			"/plugins/jquery-asColorPicker-master/css/asColorPicker.css"
		],
		js: [
			"/plugins/jquery-asColorPicker-master/libs/jquery-asColor.js",
			"/plugins/jquery-asColorPicker-master/libs/jquery-asGradient.js",
			"/plugins/jquery-asColorPicker-master/libs/jquery-asColorPicker.min.js"
		]
	};
	static jqueryAsGradient = {
		css: [],
		js: [
			"/plugins/jquery-asGradient/dist/jquery-asGradient.min.js"
		]
	};
	static jqueryDataTablesEditable = {
		css: [
			"/plugins/jquery-datatables-editable/datatables..css"
		],
		js: [
			"/plugins/jquery-datatables-editable/jquery.dataTables.js",
			"/plugins/jquery-datatables-editable/dataTables.bootstrap.js"
		]
	};
	static jqueryTimepicker = {
		css: [
			"/plugins/jquery-timepicker/jquery.timepicker.css"
		],
		js: [
			"/plugins/jquery-timepicker/jquery.timepicker.js",

		]
	};
	static jquerySparkLine = {
		css: [],
		js: [
			"/plugins/jquery-sparkline/jquery.sparkline.min.js",
			"/plugins/jquery-sparkline/jquery.charts-sparkline.js"
		]
	};
	static jqueryRepeater= {
		css: [],
		js: [
			"/plugins/jquery.repeater/src/repeater.js",
		]
	};
	static jquerySteps = {
		css: [],
		js: [
			"/plugins/jquery-steps/jquery.steps.min.js"
		]
	};
	static jqueryWizard = {
		css: [
			"/plugins/jquery-wizard-master/css/wizard.css"
			,
			"/plugins/jquery-wizard-master/libs/formvalidation/formValidation.min.css"
		],
		js: [
			"/plugins/jquery-wizard-master/dist/jquery-wizard.min.js",
			"/plugins/jquery-wizard-master/libs/formvalidation/formValidation.min.js",
			"/plugins/jquery-wizard-master/libs/formvalidation/bootstrap.min.js"
		]
	};
	/*static jqueryUi = {
		css: ['/plugins/jqueryui/jquery-ui.min.css'],
		js: [
			"/plugins/jqueryui/jquery-ui.min.js"
		]
	};*/
	static JsBarcode = {
		css: [],
		js: [
			"/plugins/JsBarcode/JsBarcode.all.min.js",
		]
	};
	static jsGrid = {
		css: [
			"/plugins/jsgrid/dist/jsgrid.min.css"
			,
			"/plugins/jsgrid/dist/jsgrid-theme.min.css"
		],
		js: [
			"/plugins/jsgrid/db.js",
			"/plugins/jsgrid/dist/jsgrid.min.js"
		]
	};
	static jTable = {
		css: [],
		js: [
			"/plugins/jtable/jquery.jtable.min.js"
		]
	};
	static knob = {
		css: [],
		js: [
			"/plugins/knob/jquery.knob.js"
		]
	};
	static magnificPopup = {
		css: [
			"/plugins/Magnific-Popup-master/dist/magnific-popup.css"
		],
		js: [
			"/plugins/Magnific-Popup-master/dist/jquery.magnific-popup.min.js"
		]
	};
	static messageBox = {
		css: [
			"/plugins/messagebox/messagebox.min.css"
		],
		js: [
			"/plugins/messagebox/messagebox.min.js"
		]
	};
	static mocha = {
		css: [],
		js: [
			"/plugins/mocha/mocha.js"
		]
	};
	static morrisJs = {
		css: [
			"/plugins/morrisjs/morris.css"
		],
		js: [
			"/plugins/raphael/raphael-min.js",
			"/plugins/morrisjs/morris.js"
		]
	};
	static multiSelect = {
		css: [
			"/plugins/multiselect/css/multi-select.css"
		],
		js: [
			"/plugins/multiselect/js/jquery.multi-select.js"
		]
	};
	static nestable = {
		css: [
			"/plugins/nestable/nestable.css"
		],
		js: [
			"/plugins/nestable/jquery.nestable.js"
		]
	};
	static owlCarousel = {
		css: [
			"/plugins/owl.carousel/owl.carousel.min.css"
			,
			"/plugins/owl.carousel/owl.theme.default.css"
		],
		js: [
			"/plugins/owl.carousel/owl.carousel.min.js",
			"/plugins/owl.carousel/owl.custom.js"
		]
	};
	static peity = {
		css: [],
		js: [
			"/plugins/peity/jquery.peity.min.js"
		]
	};
	static prettify = {
		css: [],
		js: [
			"/plugins/prettify/prettify.js"
		]
	};
	static printThis = {
		css: [],
		js: [
			"/plugins/printThis/printThis.min.js"
		]
	};
	static prism = {
		css: [
			"/plugins/prism/prism.css"
		],
		js: [
			"/plugins/prism/prism.js"
		]
	};
	static raphael = {
		css: [],
		js: [
			"/plugins/raphael/raphael.min.js"
		]
	};
	static ratyJs = {
		css: [
			"/plugins/raty-js/lib/jquery.raty.css"
		],
		js: [
			"/plugins/raty-js/lib/jquery.raty.js"
		]
	};
	static registerSteps = {
		css: [
			"/plugins/register-steps/steps.css"
		],
		js: [
			"/plugins/register-steps/jquery.easing.min.js"
		]
	};
	static selectize = {
		css: [
			"/plugins/selectize/selectize.css"
		],
		js: [
			"/plugins/selectize/selectize.min.js",
			//"/plugins/selectize/selectize.js",
		]
	};
	static select2 = {
		css: [
			"/plugins/select2/css/select2.min.css"
		],
		js: [
			"/plugins/select2/js/select2.full.min.js",
			//"/plugins/select2/css/select2.min.js"
		]
	};
	static sessionTimeout = {
		css: [
			"/plugins/session-timeout/dist/css/select2.min.css"
		],
		js: [
			"/plugins/session-timeout/jquery.sessionTimeout.min.js",
			"/plugins/session-timeout/jquery.sessionTimeout.min.simple.popup.js"
		]
	};
	static sidebarNav = {
		css: [
			"/plugins/sidebar-nav/dist/sidebar-nav.min.css"
		],
		js: [
			"/plugins/sidebar-nav/dist/sidebar-nav.min.js"
		]
	};
	static skycons = {
		css: [],
		js: [
			"/plugins/skycons/skycons.js"
		]
	};
	static sparkLine = {
		css: [],
		js: [
			"/plugins/sparkline/jquery.sparkline.min.js"
		]
	};
	static stickyKit = {
		css: [],
		js: [
			"/plugins/sticky-kit-master/dist/sticky-kit.min.js"
		]
	};
	static styleSwitcher = {
		css: [],
		js: [
			"/plugins/styleswitcher/jQuery.style.switcher.js"
		]
	};
	static summerNote = {
		css: [
			"/plugins/summernote/dist/summernote.css"
		],
		js: [
			"/plugins/summernote/dist/summernote.min.js"
		]
	};
	static sweetAlert = {
		css: [
			"/plugins/sweetalert/sweetalert.css"
		],
		js: [
			"/plugins/sweetalert/sweetalert.min.js",
			"/plugins/sweetalert/jquery.sweet-alert.custom.js"
		]
	};
	static switchery = {
		css: [
			"/plugins/switchery/dist/switchery.min.css"
		],
		js: [
			"/plugins/switchery/dist/switchery.min.js"
		]
	};
	static tableExport = {
		css: [],
		js: ['/plugins/tableExport/tableExport.js']
	};
	static tableSaw = {
		css: [
			"/plugins/tablesaw-master/dist/tablesaw.css"
		],
		js: [
			"/plugins/tablesaw-master/dist/tablesaw.js"
		]
	};
	static timePicker = {
		css: [
			"/plugins/timepicker/bootstrap-timepicker.min.css"
		],
		js: [
			"/plugins/timepicker/bootstrap-timepicker.min.js"
		]
	};
	static tinyEditable = {
		css: [],
		js: [
			"/plugins/tiny-editable/mindmup-editabletable.js",
			"/plugins/tiny-editable/numeric-input-example.js"
		]
	};
	static tinymce = {
		css: [],
		js: [
			"/plugins/tinymce/tinymce.min.js"
		]
	};
	static toast = {
		css: [
			"/plugins/toast-master/css/jquery.toast.css"
		],
		js: [
			"/plugins/toast-master/js/jquery.toast.js"
		]
	};
	static toastr = {
		css: [
			"/plugins/toastr/toastr.min.css"
		],
		js: [
			"/plugins/toastr/toastr.min.js"
		]
	};
	static typeahead = {
		css: [
			"/plugins/typeahead.js-master/dist/typehead-min.css"
		],
		js: [
			"/plugins/typeahead.js-master/dist/typeahead.bundle.min.js"
		]
	};
	static vectormap = {
		css: [
			"/plugins/vectormap/jquery-jvectormap-2.0.2.css"
		],
		js: [
			"/plugins/vectormap/jquery-jvectormap-2.0.2.min.js",
			"/plugins/vectormap/jquery-jvectormap-world-mill-en.js",
			"/plugins/vectormap/jquery-jvectormap-in-mill.js",
			"/plugins/vectormap/jquery-jvectormap-us-aea-en.js",
			"/plugins/vectormap/jquery-jvectormap-uk-mill-en.js",
			"/plugins/vectormap/jquery-jvectormap-au-mill.js",
			"/plugins/vectormap/jvectormap.custom.js"
		]
	};
	static wayPoints = {
		css: [],
		js: [
			"/plugins/waypoints/lib/jquery.waypoints.js"
		]
	};
	static wizard = {
		css: [
			"/plugins/wizard/steps.css"
		],
		js: [
			"/plugins/wizard/jquery.steps.min.js"
		]
	};
	static xEditable = {
		css: [
			"/plugins/x-editable/dist/bootstrap3-editable/css/bootstrap-editable.css"
		],
		js: [
			"/plugins/x-editable/dist/bootstrap3-editable/js/bootstrap-editable.min.js"
		]
	}

}