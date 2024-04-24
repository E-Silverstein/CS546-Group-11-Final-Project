/**
 * Checks if a value is null
 * @param {*} value 
 * @returns {boolean}
 */
export function isNull(value) {
    return value === null;
}

/**
 * Checks if any value in a list is null
 * @param {Array} list 
 * @returns {boolean}
 */
export function areAllValuesNotNull(list) {
    for(let i = 0; i < list.length; i++) {
        if(isNull(list[i])) {
            return true;
        }
    }
    return false;
}

/**
 * Checks if a value is a specified type
 * @param {*} value 
 * @param {string} type 
 * @returns 
 */
export function isOfType(value, type) {
    return typeof value === type;
}

/**
 * Checks if all values in a list are of a specified type
 * @param {Array} list 
 * @param {string} type 
 * @returns {boolean}
 */
export function areAllValuesOfType(list, type) {
    for(let i = 0; i < list.length; i++) {
        if(!isOfType(list[i], type)) {
            return false;
        }
    }
    return true;
}

/**
 * Checks if a string is a valid URL
 * @param {string} string 
 * @returns {boolean}
 */
export function isValidURL(string) {
    try {
        new URL(string);
    } catch (e) {
        return false;  
    }
    return true;
}