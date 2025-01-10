export const convertTimeStringToHours = (timeString: string): number => {
	const months = (timeString.match(/(\d+)m/) || [])[1] || 0;
	const weeks = (timeString.match(/(\d+)w/) || [])[1] || 0;
	const days = (timeString.match(/(\d+)d/) || [])[1] || 0;
	const hours = (timeString.match(/(\d+)h/) || [])[1] || 0;

	return Number(weeks) * 40 + Number(days) * 8 + Number(hours);
};
