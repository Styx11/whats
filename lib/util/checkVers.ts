export const checkVers = () => {
	const prs_vers = process.version;
	const vers = prs_vers
		.replace(/^v/i, '')
		.split('.');
	const mainVers = Number(vers[0]);
	const subVers = Number(vers[1]);

	if (mainVers > 7) return true;
	if (mainVers >= 7 && subVers >= 6) return true;
	return false;
};
