export const forbiddenWords = ["ㅅㅂ", "ㅁㅊ"];

export const filterMessage = (content) => {
    let filteredContent = content;
    forbiddenWords.forEach((word) => {
        const regex = new RegExp(`\\b${word}\\b`, "gi");
        filteredContent = filteredContent.replace(regex, "***");
    });
    return filteredContent;
};

export const isMessageFiltered = (content) => {
    return content.includes("***");
};