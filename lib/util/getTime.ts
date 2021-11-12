// getTime module returns stamp
// YYYY-MM-DD HH:MM:SS

// format subtime
const formatTime = (t: number) => {
	return t < 10 ? `0${t}` : t;
};

export default () => {
	const date = new Date();
	const year = date.getFullYear();
	const month = formatTime((date.getMonth() + 1) % 12);
	const day = formatTime(date.getDate());
	const hours = formatTime(date.getHours());
	const minutes = formatTime(date.getMinutes());
	const seconds = formatTime(date.getSeconds());

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};