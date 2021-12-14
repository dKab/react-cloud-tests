# react-cloud-tests

## Adding new version of the function:

Create an archive containing the source code and `package.json` and `package.json.lock` files:

```
rm -rf Archive.zip # to remove previously created Archives
zip -r Archive . -x '*node_modules/*' -x '*.git/*' -x '.DS_store'
```



```
yc serverless function version create \
--function-name=nodejs-function \
--runtime nodejs12 \
--entrypoint index.handler \
--source-path ./Archive.zip
```

## Invoking function in CLI: 

```
yc serverless function invoke d4epbngd07lga786meqe -d '{"body": "function sequencer(initialValue = 0, step = 1) {  let current; return function () { if (!current) { return current = initialValue; } else { current += step; return current; }}}", "queryStringParameters": {"suiteId": "sequencer"}}'
```
