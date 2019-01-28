export const configurationFile = {
    production: {
        DOMAIN_NAME: "https://xyz.com",
        API_DOMAIN_NAME: "https://api.xyz.com"
    },
    staging: {
        DOMAIN_NAME: "https://beta.xyz.com",
        API_DOMAIN_NAME: "https://alpha.xyz.com"

    },
    development: {
        DOMAIN_NAME: "https://accounts.mizekar.com",
        API_DOMAIN_NAME: "https://accounts.mizekar.com/api",

        DOMAIN_URL: "https://idea.api.mizekar.com/v1",
        API_DOMAIN_URL: "https://idea.api.mizekar.com/v1"

    },
    test: {
        DOMAIN_NAME: "http://localhost:3001",
        API_DOMAIN_NAME: "http://localhost:3000"
    }
};
  