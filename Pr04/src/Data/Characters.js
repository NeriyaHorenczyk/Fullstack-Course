const englishLower = [
    ['q','w','e','r','t','y','u','i','o','p','[',']'],
    ['a','s','d','f','g','h','j','k','l', ';',"'"],
    ['z','x','c','v','b','n','m',',','.','/']
]
const englishUpper = [
    ['Q','W','E','R','T','Y','U','I','O','P','{','}'],
    ['A','S','D','F','G','H','J','K','L', ':','"'],
    ['Z','X','C','V','B','N','M',',','.','/']
]
const hebrewLetters = [
    ['/',"'",'ק','ר','א','ט','ו','ן','ם','פ','[',']'],
    ['ש','ד','ג','כ','ע','י','ח','ל','ך', 'ף',"'"],
    ['ז','ס','ב','ה','נ','מ','צ','ת','ץ','.']
    ]

//TODO: Add French characters

const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const special =  ['!','@','#','$','%','^','&','*','(',')'];

const emojiSmileys = ['😀','😂','😍','🤣','😊','😭','😘','🤔','😎','😴','🥳','🤯']
const emojiAnimals = ['🐶','🐱','🐭','🐰','🦊','🐻','🐼','🐨','🐯','🐸','🐙','🦋']
const emojiFood    = ['🍕','🍔','🌮','🍜','🍣','🍦','🎂','☕','🍺','🍓','🥑','🌽']
const emojiObjects = ['⚽','🎸','🎮','📱','💻','🎈','🎉','❤️','⭐','🔥','💡','🎁']
const emojiExtra   = ['👍','👎','👏','🙌','🤝','💪','👀','🧠','💀','👻','🤖','👽']
const emojiSymbols = ['✅','❌','⚠️','💯','🔴','🟢','🔵','🟡','🔑','🔒','💰','📌']

export const characters = {
    English: {
        primary: englishLower,
        secondary: englishUpper,
        numbers: numbers,
        special: special
    },
    Hebrew: {
        primary: hebrewLetters,
        numbers: numbers,
        special: special
    },
    Emoji: {
        primary: [emojiSmileys, emojiAnimals, emojiFood, emojiObjects],
        numbers: emojiExtra,
        special: emojiSymbols
    }

    //TODO: Add French characters
}