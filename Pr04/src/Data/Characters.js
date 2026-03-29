const englishLower = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const englishUpper = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const hebrewLetters = ['א','ב','ג','ד','ה','ו','ז','ח','ט','י','כ','ך','ל','מ','ם','נ','ן','ס','ע','פ','ף','צ','ץ','ק','ר','ש','ת'];
//TODO: Add French characters

const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const special = ['!','?',',','.','@','#','$','%','&','(',')','-','+','=','"',"'",' '];

export const characters = {
    English: { primary: [...englishLower, ...numbers, ...special], secondary: [...englishUpper, ...numbers, ...special] },
    Hebrew: { primary: [...hebrewLetters, ...numbers, ...special]},
    //TODO: Add the French Array
}