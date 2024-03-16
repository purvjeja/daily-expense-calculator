import { IAPIStructure, IUser } from "@/interface/main.interface";

const bin_version = "65f0ba97dc74654018b1fe10";

export const getData = async () => {
	const dataItem = await fetch(`https://api.jsonbin.io/v3/b/${bin_version}`, {
		headers: { "X-Master-Key": "$2b$10$36wvnzpKZqVs9l1ZsHS2jON.JWV9pBcgmU98Oce5jnCYheagDHuyq" },
	}).then((res) => res.json());

	return dataItem.record;
};

export const postData = async (dataToPost: IAPIStructure) => {
	const responseData = await fetch(`https://api.jsonbin.io/v3/b/${bin_version}`, {
		method: "PUT",
		headers: { "X-Master-Key": "$2b$10$36wvnzpKZqVs9l1ZsHS2jON.JWV9pBcgmU98Oce5jnCYheagDHuyq", "Content-Type": "application/json" },
		body: JSON.stringify(dataToPost),
	}).then((res) => res.json());

	return responseData;
};

export const updateUser = async (userName: string, userObject: IUser) => {
	const data: IAPIStructure = await getData();
	let dataObject = data;
	dataObject[userName] = userObject;
	const responseData = postData(dataObject);
	setUserDetailsToLocalStorage(userName);
	return responseData;
};

export const setUserDetailsToLocalStorage = (userName: string) => {
	localStorage.setItem("userName", userName);
	// localStorage.setItem("userObject", JSON.stringify(userObject));
};
