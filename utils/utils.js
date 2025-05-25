export const debounce = (func, timer = 1000) => {
    let id;

    return function (...params) {
        clearTimeout(id)
        id = setTimeout(() => {
            func.apply(this, params)
        }, timer);
    }
}