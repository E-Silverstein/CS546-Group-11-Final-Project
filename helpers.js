import { ObjectId } from "mongodb";


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

export function isValidBio(input) {
    if (input == null) return false;
    if (typeof input != 'string') return false;

    if (input.length > 256) return false;
    else return true;
}


export function isValidString(input, min_len=0, max_len=Number.MAX_VALUE) {
    if (input == null) return false;
    if (typeof input != 'string') return false;
    if (input.trim() == '') return false;
    if (input.length < min_len || input.length > max_len) return false;
    else return true;
}

export function isValidId(input) {
    if (!isValidString(input)) return false;
    input = input.trim();
    if (!ObjectId.isValid(input)) return false;
    else return true;
}

export function isValidUsername(input) {
    if(!isValidString(input, 5, 32)) return false;
    input = input.trim();

    if (input.match(/[^\w.-]/) != null) return false;
    else return true;

}

export function isValidPassword(input) {
    if(!isValidString(input, 8, 32)) return false;
    input = input.trim();
    if (input.match(/[0-9]/g) == null) return false;
    if (input.match(/[A-Z]/g) == null) return false;
    if (input.match(/[^\w]/g) == null) return false;
    if (input.match(' ') != null) return false;
    return true;
}

export function isValidLink(input) {
    if(!isValidString(input)) return false;
    input = input.trim();
    if (input.match(/^https?:\/\/(?:www\.)?\w{0,64}\.(?:com|co\.\w{2})/) == null) return false;
    else return true;

}

export function isValidImg(input) {
    if (!input) return false;
    if (!input.mimetype.includes('image/'))return false;
    else return true;
}

export function isValidKeyword(input) {
    if(!isValidString(input, 3, 16))
    return false;
    else return true;

}

