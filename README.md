# Sign in with Ethereum
Reference implementation for use with Giveth.io
### Build Status:
- Develop - [![CI/CD](https://github.com/Giveth/SiweAuthMicroservice/actions/workflows/CI-CD.yml/badge.svg?branch=develop)](https://github.com/Giveth/SiweAuthMicroservice/actions/workflows/CI-CD.yml)
- Staging - [![CI/CD](https://github.com/Giveth/SiweAuthMicroservice/actions/workflows/CI-CD.yml/badge.svg?branch=staging)](https://github.com/Giveth/SiweAuthMicroservice/actions/workflows/CI-CD.yml)
- Production - [![CI/CD](https://github.com/Giveth/SiweAuthMicroservice/actions/workflows/CI-CD.yml/badge.svg?branch=main)](https://github.com/Giveth/SiweAuthMicroservice/actions/workflows/CI-CD.yml)
---
## References
I used these articles for writing project

* https://blog.logrocket.com/linting-typescript-using-eslint-and-prettier

* https://rsbh.dev/blog/rest-api-with-express-typescript


### Migrations

#### Create new Migration file

```
typeorm migration:create ./migrations/createAccessTokenTable
```


#### Then you need to run the migrations like so:

```
npm run db:migrate:run:local
```

#### If you want to revert last migration :

```
npm run db:migrate:revert:local

```
