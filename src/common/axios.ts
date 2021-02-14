import axios, { AxiosRequestConfig } from "axios";
import { INNERTUBE_API_KEY, INNERTUBE_CLIENT_VERSION } from "../constants";

const axiosInstance = axios.create();

export const axiosRequestInterceptor = (config: AxiosRequestConfig): AxiosRequestConfig => {
	if (config.method?.toUpperCase() === "POST") {
		config.params = {
			key: INNERTUBE_API_KEY,
			...config.params,
		};
		config.data = {
			context: {
				client: {
					clientName: "WEB",
					clientVersion: INNERTUBE_CLIENT_VERSION,
				},
			},
			...config.data,
		};
	} else if (config.method?.toUpperCase() === "GET") {
		config.headers = {
			"x-youtube-client-version": INNERTUBE_CLIENT_VERSION,
			"x-youtube-client-name": 1,
		};
		config.params = {
			...config.params,
		};
	}
	return config;
};

axiosInstance.interceptors.request.use(axiosRequestInterceptor);
axiosInstance.defaults.validateStatus = () => true;

export default axiosInstance;
