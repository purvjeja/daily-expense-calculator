export const toggleUserPreferedTheme = () => {
	if (localStorage.theme !== "dark") {
		document.documentElement.classList.add("dark");
		localStorage.theme = "dark";
	} else {
		document.documentElement.classList.remove("dark");
		localStorage.theme = "light";
	}
};

export const setTheme = () => {
	if (localStorage.theme === "dark" || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
		document.documentElement.classList.add("dark");
		localStorage.theme = "dark";
		return "dark";
	} else {
		document.documentElement.classList.remove("dark");
		localStorage.theme = "light";
		return "light";
	}
};
