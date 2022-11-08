module.exports = {
  testMatch: ["**/test/**/(*.)+(spec|test).[jt]s?(x)"],
  transformIgnorePatterns: ["../node_modules/(?!react-dnd|dnd-core)"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga|txt)$":
      "<rootDir>/test/__mocks__/fileMock.js",
    "\\.(css|scss)$": "<rootDir>/test/__mocks__/styleMock.js",
  },
};
