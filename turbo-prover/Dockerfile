FROM node:16-alpine3.15 AS builder
WORKDIR /usr/src/standard-prover-verifier
COPY . .
RUN yarn cache clean && yarn install --frozen-lockfile && yarn test && yarn build && rm -rf node_modules && yarn cache clean

FROM alpine:latest
COPY --from=builder /usr/src/standard-prover-verifier /usr/src/standard-prover-verifier
