import { prefix } from "@/settings";
const TokenKey = `${prefix}_token`+'_platform';

export function getToken() {
	return localStorage.getItem(TokenKey);
}

export function setToken(token) {
	return localStorage.setItem(TokenKey, token);
}

export function removeToken() {
	return localStorage.removeItem(TokenKey);
}

export function setUserInfo(key,value) {
	return localStorage.setItem(prefix+'_'+key,value);
}
export function getUserInfo(key) {
	return localStorage.getItem(prefix+'_'+key);
}
export function removeUserInfo(key) {
	return localStorage.removeItem(prefix+'_'+key);
}
