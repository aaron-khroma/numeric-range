if (typeof noUiSlider === 'undefined') {
  throw new Error('NumericRange is missing vendor library noUiSlider');
}

const defaultStep = 1;
const selectors = {
  numericRange: 'numeric-range',
  slider: '.numeric-range__slider',
  inputMin: '.numeric-range__input-min',
  inputMax: '.numeric-range__input-max',
  displayMin: '.numeric-range__display-min',
  displayMax: '.numeric-range__display-max'
};

customElements.define('numeric-range', class NumericRange extends HTMLElement {
  constructor() {
    super();
    this.container = this;
  }

  connectedCallback() {
    this.init();
  }

  init() {

    this.formEl = this.container.closest('form');
    this.contentEl = this.container.closest('div');
    this.sliderEl = this.container.querySelector(selectors.slider);
    this.inputMinEl = this.container.querySelector(selectors.inputMin);
    this.inputMaxEl = this.container.querySelector(selectors.inputMax);
    this.displayMinEl = this.container.querySelector(selectors.displayMin);
    this.displayMaxEl = this.container.querySelector(selectors.displayMax);

    this.checkboxes = [...this.contentEl.querySelectorAll('ul li input')];

    let valueStringList = this.container.dataset.valueList.split(',') || ['0', '100'];
    this.valueList = valueStringList.map(val => parseFloat(val));
    this.minRange = parseFloat(this.container.dataset.min) || 0;
    this.minValue = parseFloat(this.container.dataset.minValue) || 0;
    this.maxRange = parseFloat(this.container.dataset.max) || 100;
    this.maxValue = parseFloat(this.container.dataset.maxValue) || this.maxRange;
    this.increment = parseFloat(this.container.dataset.inc) || defaultStep;

    return this.createNumericRange();
  }

  createNumericRange() {
    if (this.sliderEl && this.sliderEl.noUiSlider && typeof this.sliderEl.noUiSlider.destroy === 'function') {
      this.sliderEl.noUiSlider.destroy();
    }

    let condensedValues = [this.valueList[0]], 
    finalValue = this.valueList[this.valueList.length - 1],
    ranges = {
      min: this.minRange,
      max: this.maxRange,
    };
    if (this.valueList.length > 2) {
      let sliderSpan = ranges.max - ranges.min,
      valueDensity = 0.15,
      prevValue = this.valueList[0];
      for (let v = 1; v < this.valueList.length - 1; v++) {
        let value = this.valueList[v];

        if ((value - prevValue) / sliderSpan > valueDensity) {
          condensedValues.push(value);
          prevValue = value;
        }

        let segment = value - ranges.min;
        let rangePercent = Math.round(segment / sliderSpan * 100);
        ranges[rangePercent + '%'] = value;
      }
      if ((finalValue - prevValue) / sliderSpan < valueDensity) condensedValues.pop();
    }
    condensedValues.push(finalValue);

    const slider = noUiSlider.create(this.sliderEl, {
      connect: true,
      step: this.increment,
      start: [this.minValue, this.maxValue],
      range: ranges,
      snap: true,
      pips: {
        mode: 'values',
        values: condensedValues,
        density: 10,
      },
    });

    slider.on('update', values => { 
      /* UPDATE TRIGGERS ON
      - A handle moves while dragging
      - A connect moves while dragging
      - The .set() method is called
      - When bound using the .on() method
      - A slider is moved by tapping it
      - A handle is moved by arrow keys
      */
      this.displayMinEl.innerHTML = Math.round(values[0]);
      this.displayMaxEl.innerHTML = Math.round(values[1]);

      document.dispatchEvent(new CustomEvent('numeric-range:update', {
        detail: values,
      }));
    });

    slider.on('change', values => {
      /* CHANGE TRIGGERS ON
      - A handle is released after dragging
      - A slider is moved by tapping it
      - A handle is moved by arrow keys
      */
      let [ min, max ] = values;
      this.valueList.forEach((val, i) => {
        console.assert(this.valueList.length == this.checkboxes.length, 
          'Length of value list attribute differs from checkbox length! UH OH!');
        let checkbox = this.checkboxes[i];
        if (min <= val && val <= max) {
          checkbox.setAttribute('checked', '');
        } else {
          checkbox.removeAttribute('checked');
        }
      });

      const formData = new FormData(this.formEl);
      
      document.dispatchEvent(new CustomEvent('numeric-range:change', {
        detail: formData,
      }));
    });

    return slider;
  }
});
