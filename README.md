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
npm run typeorm:cli -- migration:run
```

#### If you want to revert last migration :

```
npm run typeorm:cli -- migration:revert
```
