import Button = TableAction.Button;
import DropDown = TableAction.DropDown;

export namespace TableAction {
	export class Button {
		public html: string = '';
		public dropDown: string = '';

		constructor(public type: ButtonType, private link: string, private text: string, targetOrText?: string, data?: object) {
			switch (type) {
				case TableAction.ButtonType.BLANK_LINK:
					this.html += '<a href="' + link + '" target="_blank" class="btn btn-sm ta-btn">' + text + '</a>';
					break;
				case TableAction.ButtonType.DROPDOWN:
					this.html += '<button type="button" class="btn dropdown-toggle dropdown-toggle-split ta-btn-dd btn-themecolor px-3"' +
						' data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">' +
						'</button>';
					break;
				case TableAction.ButtonType.DELETE:
					this.html += "<a href='javascript:void(0);' class='btn btn-sm ta-btn' onclick=\"confirmDelete('" + link + "', '" + (targetOrText ? targetOrText : '') + "')\">" + text + "</a>";
					break;
				case TableAction.ButtonType.POPUP:
					this.html += "<a href='javascript:void(0);' class='btn btn-sm ta-btn' onclick=\"showPopup('" + targetOrText + "', '" + link + "', " + (data ? data : null) + ")\">" + text + "</a>";
					break;
				case TableAction.ButtonType.SELF_LINK:
					this.html += '<a href="' + link + '" target="_self" class="btn btn-sm ta-btn">' + text + '</a>';
					break;
			}

		}
	}

	export class DropDown {
		public html: string = '';

		constructor(private type: ButtonType.BLANK_LINK | ButtonType.POPUP | ButtonType.SELF_LINK | ButtonType.DELETE,
		            private link: string, private text: string, targetOrText?: string, data?: object) {
			switch (type) {
				case TableAction.ButtonType.BLANK_LINK:
					this.html += '<a href="' + link + '" target="_blank" class="dropdown-item">' + text + '</a>';
					break;
				case TableAction.ButtonType.POPUP:
					this.html += "<a href='javascript:void(0);' class='dropdown-item' onclick=\"showPopup('" + targetOrText + "', '" + link + "', " + (data ? data : null) + ")\">" + text + "</a>";
					break;
				case TableAction.ButtonType.SELF_LINK:
					this.html += '<a href="' + link + '" target="_self" class="dropdown-item">' + text + '</a>';
					break;
				case TableAction.ButtonType.DELETE:
					this.html += "<a href='javascript:void(0);' class='dropdown-item' onclick=\"confirmDelete('" + link + "', '" + (targetOrText ? targetOrText : '') + "')\">" + text + "</a>";
					break;
			}
		}

	}

	export enum ButtonType {
		SELF_LINK,
		BLANK_LINK,
		POPUP,
		DROPDOWN,
		DELETE
	}
}

export class Action {
	public html: string = '<div class="btn-group dropleft">';

	constructor(private buttons: Array<Button>, private dropDown?: Array<DropDown>) {
		buttons.forEach(value => {
			this.html += value.html;
			if (dropDown) {
				if (value.type == TableAction.ButtonType.DROPDOWN) {
					this.html += '<div class="dropdown-menu tiny">';
					dropDown.forEach(drop => {
						this.html += drop.html;
					});
					this.html += '</div>';
				}
			}
		});
		this.html += '</div>';
	}
}