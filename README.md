# @yek-plus/strapi-crack

> :warning: This project is only for technique testing, DO NOT use this package in any production environment!

Usage:
``` shell
npx @yek-plus/strapi-crack
```

Use with options:
``` shell
npx @yek-plus/strapi-crack --dir [strapi-project-dir]
```

To run this package automatically, you can modify your package.json file.

``` json
{
    "scripts": {
        "postinstall": "npx @yek-plus/strapi-crack"
    }
}
```

## Usage With `Dockerfile`

According to [Strapi official documentation about dockerize](https://docs.strapi.io/cms/installation/docker#production-dockerfile) this Dockerfile is recommended.

```Dockerfile
# Creating multi-stage build for production
FROM node:22-alpine AS build
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev git > /dev/null 2>&1
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/
COPY package.json package-lock.json ./
RUN npm install -g node-gyp
RUN npm config set fetch-retry-maxtimeout 600000 -g && npm install --only=production
ENV PATH=/opt/node_modules/.bin:$PATH
WORKDIR /opt/app
COPY . .
RUN npm run build

# Creating final production image
FROM node:22-alpine
RUN apk add --no-cache vips-dev
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /opt/
COPY --from=build /opt/node_modules ./node_modules
WORKDIR /opt/app
COPY --from=build /opt/app ./
ENV PATH=/opt/node_modules/.bin:$PATH

RUN chown -R node:node /opt/app
USER node
EXPOSE 1337
CMD ["npm", "run", "start"]
```

You need to:
1. Install openssl on packge install step on buld stage.
2. Run `npx @yek-plus/strapi-crack` command before changing workdir.
3. Copy `license.txt` from build stage to last stage.

After these changes Your Dockerfile should look like this

```Dockerfile
# Creating multi-stage build for production
FROM node:22-alpine AS build
RUN apk update && apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev vips-dev git openssl > /dev/null 2>&1
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /opt/
COPY package.json package-lock.json ./
RUN npm install -g node-gyp
RUN npm config set fetch-retry-maxtimeout 600000 -g && npm install --only=production
ENV PATH=/opt/node_modules/.bin:$PATH
RUN npx @yek-plus/strapi-crack
WORKDIR /opt/app
COPY . .
RUN npm run build

# Creating final production image
FROM node:22-alpine
RUN apk add --no-cache vips-dev
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /opt/
COPY --from=build /opt/node_modules ./node_modules
WORKDIR /opt/app
COPY --from=build /opt/app ./
COPY --from=build /opt/license.txt ./
ENV PATH=/opt/node_modules/.bin:$PATH

RUN chown -R node:node /opt/app
USER node
EXPOSE 1337
CMD ["npm", "run", "start"]
```


## Supported Strapi Versions

| Version | Supported          |
| ------- | ------------------ |
| 5.x     | :white_check_mark: |
| 4.x     | :white_check_mark: |
| < 4.0   | :x:                |

> :pray: Thank to [iopanda](https://github.com/iopanda)
