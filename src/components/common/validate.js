import $ from "jquery";
export function validateExistence(arr) {
  var flag = true;
  var i = 0;
  var items = [];
  arr.map((el) => {
    i = i + 1;
    if (!this.state[el]) {
      items.push(el);
      flag = false;
    }
  });
  if (arr.length === i) {
    console.log(i, this.state.validationItems);
    this.setState({ validationItems: items });
    if (!flag) {
      this.modal.current.click();
    }
    return flag;
  }
}
