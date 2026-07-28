To run locally:

1. Create `package.json` based on the template and resolve dependencies (the template's versions are a starting point — bump them as needed):
```bash
cp package.json.template package.json
yarn install
```
2. Run serverless offline
```bash
serverless offline
```
3. Deploy using a custom domain
To deploy custom domain
```bash
serverless create_domain
```
4. Deploy
```bash
serverless deploy
```
