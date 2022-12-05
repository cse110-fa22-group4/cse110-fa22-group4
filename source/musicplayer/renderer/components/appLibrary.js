// Preferred grid settings
const gridSettings = {
	sort: true,
	resizable: true,
	fixedHeader: true,
	autoWidth: true,
	search: {
		enabled: true,
		keyword: '',
	},
};

// Library Headers
const libraryHeaders = [
	{hidden: false, sort: {enabled: true}, name: '#', id: 'track', formatter: (cell) => 
        `${cell.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})}`},
    // https://stackoverflow.com/questions/8043026/how-to-format-numbers-by-prepending-0-to-single-digit-numbers
	{hidden: false, sort: {enabled: true}, name: 'title'},
	{hidden: false, sort: {enabled: true}, name: 'artist'},
	{hidden: false, sort: {enabled: true}, name: 'album'},
	{hidden: false, sort: {enabled: true}, name: 'year', id: 'date'},
	// {hidden: false, sort: {enabled: true}, name: 'year'},
	{hidden: false, sort: {enabled: true}, name: 'duration',
		formatter: (cell) => `${new Date(1000 * cell).toISOString().substr(11, 8).replace(/^[0:]+/, '')}`},
	// https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
	{hidden: false, sort: {enabled: true}, name: 'genre'},
	// {hidden: false, sort: {enabled: true}, name: 'tags'},

	// hidden categories
	{hidden: true, sort: {enabled: false}, name: 'artwork'},
	{hidden: true, sort: {enabled: false}, name: 'filename'},
];


