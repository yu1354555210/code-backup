/**
 * 5+环境下的原生tabbar突起按钮
 * version:1.0.2
 */
import icon64 from './icon.base64.js';
import * as utils from './utils.js';

export default class OverflowButton {
	constructor() {
		let width = uni.upx2px(140);
		let height = uni.upx2px(140);
		let left = "auto";
		let top = 0;
		let offset = uni.upx2px(26);
		this.tabCount = 0;
		this.config = {
			id: utils.guid(),
			icon: {
				src: icon64,
				width,
				height,
				left,
				top,
				offset
			},
			delay: {
				show: 50,
				hide: 150
			}
		};
		this.viewInstence = null;
		this.avaliable=true;
	}
	static getInstance() {
		if (!OverflowButton.instance) {
			OverflowButton.instance = new OverflowButton();
		}
		return OverflowButton.instance;
	}

	create(config = {}) {
		this.config =utils.mergeDeep(this.config,config)
		const {
			id,
			icon
		} = this.config
		this.viewInstence = new plus.nativeObj.View(id, {
			width: `${icon.width}px`,
			height: `${icon.height+icon.offset}px`,
			left: `${Math.ceil((plus.screen.resolutionWidth - icon.width) / 2)}px`,
			bottom: 0
		});
		var bitmap = new plus.nativeObj.Bitmap('bmp-' + id);
		bitmap.loadBase64Data(
			icon.src,
			() => {
				this.viewInstence.draw([{
						tag: 'rect',
						id: 'rect-' + id,
						color: 'rgba(0,0,0,0)',
						position: {
							top: '0px',
							left: '0px',
							width: "100%",
							height: "100%",
						}
					},
					{
						tag: 'img',
						id: 'img-' + id,
						src: bitmap,
						position: {
							width: `${icon.width}px`,
							height: `${icon.height}px`,
							left: `${icon.left}px`,
							top: `${icon.top}px`
						}
					}
				]);
			},
			error => {
				console.log(error);
			}
		);

	}
	show() {
		this.tabCount += 1;
		if (this.viewInstence) {
			setTimeout(() => {
				this.viewInstence.show()
			}, this.config.delay.show)
		}
	}
	hide() {
		this.tabCount -= this.tabCount === 0 ? 0 : 1;
		setTimeout(() => {
			if (!this.tabCount) {
				this.viewInstence && this.viewInstence.hide();
			}
		}, this.config.delay.hide)
	}
	destroy() {
		this.viewInstence=null;
	}

	setListener(type, listener) {
		this.viewInstence.addEventListener(type, function(e) {
			listener && listener(e)
		});
	}
	
	setOnClickListener(callback){
		this.setListener('click', e=>{
			if(this.avaliable){
				this.avaliable=false;
				setTimeout(()=>{
					this.avaliable=true;
				},500)
				callback(e);
			}
		});
	}

	getView() {
		return this.viewInstence;
	}
}
