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
    if (input == null) throw "Error: No string input";
    if (typeof input != 'string') throw "Error: Input is not a string";

    if (input.length > 256) throw "Error: Input does not fit length constraints";
}


export function isValidString(input, min_len=0, max_len=Number.MAX_VALUE) {
    if (input == null) throw "Error: No string input";
    if (typeof input != 'string') throw "Error: Input is not a string";
    if (input.trim() == '') throw "Error: String input cannot be empty";

    if (input.length < min_len || input.length > max_len) throw "Error: Input does not fit length constraints";
}

export function isValidId(input) {
    isValidString(input);
    input = input.trim();
    if (!ObjectId.isValid(input)) throw "Error: Input is not a valid id"
}

export function isValidUsername(input) {
    isValidString(input, 5, 32);
    input = input.trim();

    if (input.match(/[^\w.-]/) != null) throw "Error: Username can only contain numbers, letters, '-', '_', and '.'";
}

export function isValidPassword(input) {
    isValidString(input, 8, 32);
    input = input.trim();
    if (input.match(/[0-9]/g) == null) throw "Error: Password must contain at least one number";
    if (input.match(/[A-Z]/g) == null) throw "Error: Password must contain at least one uppercase character";
    if (input.match(/[^\w]/g) == null) throw "Error: Password must contain at least one special character";
    if (input.match(' ') != null) throw "Error: Password cannot contain spaces"
}

export function isValidLink(input) {
    isValidString(input);
    input = input.trim();
    if (input.match(/^https?:\/\/(?:www\.)?\w{0,64}\.(?:com|co\.\w{2})/) == null) throw "Error: Invalid link";

}

export function isValidImg(input) {
    if (!input) throw "Error: No file input";
    if (!input.mimetype.includes('image/')) throw "Error: file must be an image input";
}

export function isValidKeyword(input) {
    isValidString(input, 3, 16);
    return true;
}

