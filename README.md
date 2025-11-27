## Project setup

```bash
$ cd server
$ yarn install
```
### Creating .env
```bash
$ nano .env
```

### Push database
```bash
$ yarn prisma generate
$ yarn prisma db push
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```
