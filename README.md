# TMA-Backend
본 프로젝트는 무엇이든 말해보설의 BE 입니다.

## 빠른 실행
```shell
yarn global add nodemon
yarn install
cp config/default.json config/default.json
yarn start
```

## 필요 사항
* node v14.15.1
* yarn

## 설정
json 파일을 사용해 실행시 필요한 설정을 할 수 있습니다.

### 설정 파일 생성
설정을 위해서 config/default.json 파일을 생성해야 합니다.
```shell
cp config/default.json config/default.json
```

### 설정 값 목록
```json
{
    "cors": {
        "origin": "*",
        "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "preflightContinue": false,
        "optionsSuccessStatus": 204
    },
    "db": {
        "uri": "mongo db uri"
    }
}
```
