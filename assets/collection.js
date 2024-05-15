
initNumericRange() {
  document.addEventListener('numeric-range:change', onNumericRangeChange);
}

onNumericRangeChange(event) {
  // Replace with whatever function re-renders the collection
  someRenderingFunction(event.detail);
}