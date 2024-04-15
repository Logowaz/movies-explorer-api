// eslint-disable-next-line no-useless-escape
const regExpUrl = /^(https?:\/\/)?[^\s]*\.(jpg|jpeg|png|gif|bmp|test)$/;
const regExpUrlMovies = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|rutube\.ru)\/(.+)$/;
module.exports = { regExpUrl, regExpUrlMovies };
