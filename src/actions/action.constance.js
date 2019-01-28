import {configurationFile} from "../utils/config";

export const API_URL_ROOT = configurationFile["development"].API_DOMAIN_NAME;
export const API_URL = configurationFile["development"].API_DOMAIN_URL;
export const DOMAIN_NAME = configurationFile["development"].DOMAIN_NAME;


export const ORG_ID='3e2686b4-bc4f-491f-aaf0-711e707116ef';
export const SUCCESS = "Success";
export const FAIL = "fail";
export const REQUESTING = "requesting";
export const ERROR = "error";