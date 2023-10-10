To run locally:

1. Create `package.json` / `yarn.lock` based on the template (you may want to update dependencies for security reasons):
```back
cp package.json.template package.json
cp yarn.lock.template yarn.lock
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
