# build environment
FROM node:11.9.0 as builder
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.json /usr/src/app/package.json
RUN rm -rf node_modules
RUN npm install
COPY . /usr/src/app


#rdp2 bug fixed
RUN rm -rf node_modules/react-datepicker2/dist/index.js
RUN rm -rf node_modules/react-datepicker2/src/components/DatePicker.js
COPY rdp-fix/index.js node_modules/react-datepicker2/dist/index.js
COPY rdp-fix/DatePicker.js node_modules/react-datepicker2/src/components/DatePicker.js
RUN rm -rf rdp-fix

RUN npm install react-scripts@2.1.3 -g --silent
RUN npm run build

# Stage 2 - the production environment
FROM nginx:1.15.8-alpine
COPY --from=builder /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
