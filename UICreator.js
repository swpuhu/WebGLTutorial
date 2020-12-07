/**
 *
 * @param {Array} arr
 * @param {number} index
 */
function fastRemove(arr, index) {
    arr[index] = arr[arr.length - 1];
    arr.pop();
}

export class BaseUI {
    constructor() {
        this.eventList = {};
        this.name = "BaseUI";
    }

    /**
     *
     * @param {string} name
     * @param {Function} fn
     * @param {Object} target
     */
    on(name, fn, target) {
        if (!this.eventList[name]) {
            this.eventList[name] = [];
        }
        this.eventList[name].push({
            target: target,
            fn: fn,
        });
    }

    /**
     *
     * @param {string} name
     * @param {Function} fn
     */
    off(name, fn) {
        if (!this.eventList[name]) {
            return;
        }
        let index = this.eventList[name].findIndex((item) => item.fn === fn);
        if (index > -1) {
            fastRemove(this.eventList[name], index);
        }
    }

    dispatch(name, ...args) {
        if (!this.eventList[name]) {
            return;
        }
        let funcs = this.eventList[name];
        for (let i = 0; i < funcs.length; i++) {
            funcs[i].fn.apply(funcs[i].target || this, args);
        }
    }
}

export class Slider extends BaseUI {
    constructor({
        min: min,
        max: max,
        value: value = 0,
        step: step = 1,
        width: width = 200,
        height: height = 5,
        labelText: labelText,
        indicator: indicator = true,
    }) {
        super();
        this.min = min;
        this.max = max;
        this.range = max - min;
        this.step = step;
        this.value = value;
        this.width = width;
        this.height = height;
        this.labelText = labelText;
        this.indicator = indicator;

        this.sliderRootDom = null;
        this.rootDom = null;
        this.sliderDom = null;
        this.pointDom = null;
        this.labelDom = null;
        this.indicatorDom = null;

        this.onChange = null;
        this.onChangeStart = null;
        this.onChangeEnd = null;
        this.init();
    }

    init() {
        this.createDOM();
        this.bindEvent();
    }

    createDOM() {
        this.rootDom = document.createElement("div");
        this.rootDom.style.cssText = `
            display: flex;
            align-items: center;
        `;

        this.sliderRootDom = document.createElement("div");
        this.sliderRootDom.style.cssText = `position: relative;width: ${this.width}px;height: ${this.height}px`;

        this.sliderDom = document.createElement("div");
        this.sliderDom.style.cssText = `position: absolute; width: 100%;height: 100%; background: #ffdcb8`;

        this.pointDom = document.createElement("div");
        this.pointDom.style.cssText = `
            position: absolute;
            top: ${this.height / 2}px; 
            left: ${Math.floor(
                ((this.value - this.min) / this.range) * this.width
            )}px;
            width: 20px;
            height: 20px; 
            border-radius: 50%; 
            background: #f60; 
            transform: translate(-50%, -50%)
        `;

        if (this.labelText) {
            this.labelDom = document.createElement("div");
            this.labelDom.style.cssText = `margin: 0 10px`;
            this.labelDom.textContent = this.labelText;
            this.rootDom.appendChild(this.labelDom);
        }

        this.sliderRootDom.appendChild(this.sliderDom);
        this.sliderRootDom.appendChild(this.pointDom);

        this.rootDom.appendChild(this.sliderRootDom);

        if (this.indicator) {
            this.indicatorDom = document.createElement("div");
            this.indicatorDom.style.cssText = `margin: 0 10px`;
            this.indicatorDom.textContent = this.value.toFixed(2);
            this.on("_change", function (value) {
                this.indicatorDom.textContent = value.toFixed(2);
            });
            this.rootDom.appendChild(this.indicatorDom);
        }
    }

    bindEvent() {
        this.pointDom.onmousedown = (e) => {
            const initX = Math.floor(
                ((this.value - this.min) / this.range) * this.width
            );
            this.onChangeStart && this.onChangeStart(this.value);
            const move = (ev) => {
                const offsetX = ev.clientX - e.clientX;
                this.value =
                    ((initX + offsetX) / this.width) * this.range + this.min;
                this.value = this.value - (this.value % this.step);
                if (this.value < this.min) {
                    this.value = this.min;
                } else if (this.value > this.max) {
                    this.value = this.max;
                }
                this.onChange && this.onChange(this.value);
                this.dispatch("_change", this.value);
                this.pointDom.style.left =
                    Math.floor(
                        ((this.value - this.min) / this.range) * this.width
                    ) + "px";
            };

            const up = () => {
                this.onChangeEnd && this.onChangeEnd(this.value);
                this.pointDom.title = this.value;
                document.removeEventListener("mousemove", move);
                document.removeEventListener("mouseup", up);
            };

            document.addEventListener("mousemove", move);
            document.addEventListener("mouseup", up);
        };
    }

    setValue(value) {
        if (value < this.min) {
            this.value = this.min;
        } else if (value > this.max) {
            this.value = this.max;
        }
        this.value = value;
        this.pointDom.style.left =
            Math.floor(((this.value - this.min) / this.range) * this.width) +
            "px";
        this.onChange && this.onChange(this.value);
    }

    /**
     *
     * @param {HTMLElement} dom
     */
    mountTo(dom) {
        dom.appendChild(this.rootDom);
    }
}

export class Input extends BaseUI {
    constructor({ label: label = "", type: type = "text", value: value = 0 }) {
        super();
        this.label = label;
        this.type = type;
        this.value = value;
        this.rootDom = null;
        this.labelDom = null;
        this.input = null;
        this.init();
    }

    init() {
        this.createDOM();
        this.bindEvent();
    }

    createDOM() {
        this.rootDom = document.createElement("div");
        this.rootDom.style.cssText = `display: flex`;

        this.labelDom = document.createElement("div");
        this.labelDom.style.flexBasis = "100px";
        this.labelDom.textContent = this.label;

        this.input = document.createElement("input");
        this.input.type = this.type;
        this.input.value = this.value;

        this.rootDom.appendChild(this.labelDom);
        this.rootDom.appendChild(this.input);
    }

    bindEvent() {
        this.input.oninput = () => {
            this.value = this.input.value;
            this.dispatch("change", this.value);
        };

        this.input.onclick = () => {
            this.input.select();
        };
    }

    setValue(v) {
        this.value = this.input.value = v;
    }

    getValue(v) {
        return this.value;
    }

    mountTo(dom) {
        dom.appendChild(this.rootDom);
    }
}
