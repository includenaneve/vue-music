export function addClass(el, className) {
  if (hasClass(el, className)) {
    return;
  }
  let newClass = el.className.split(' ');
  newClass.push(className);
  el.className = newClass.join(' ');
}

export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
  return reg.test(el.className);
}

export function getData(element, name, value) {
  const prefix = 'data-';
  const propName = prefix + name;
  if (value) {
    return element.setAttribute(propName, value);
  } else {
    return element.getAttribute(propName);
  }
}
