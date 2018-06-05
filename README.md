# Dota Wiki Api
A module to communicate with the [Liquipedia Dota 2 Wiki](http://liquipedia.net/dota2/Main_Page) to fetch Team Info, DPC Rankings, Dota Game Schedules, and more!

## Setup
Install DotaWikiApi with `npm` (or preferred package manager)

```bash
npm i --save dota-wiki-api
```

Import or require the file, and initialize it with an [configuration object](https://github.com/ammuench/dota-wiki-api/blob/master/API.md#options)

```javascript
import { DotaWikiApi } from 'dota-wiki-api';

const myConfig = {
    userAgentValue: 'MyConfig/0.0.1 (https://github.com/myGithub/myDotaApp)',
}

const myDotaWikiApi = new DotaWikiApi(myConfig);

myDotaWikiApi.getAllRanks()
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    
```

`DotaWikiApi` is written in Typescript, and therefore also provides typings support out of the box

## Documentation
All documentation and API information can be found in the [API Document here](https://github.com/ammuench/dota-wiki-api/blob/master/API.md)

## Contribution
If you would like to help or build on this module, please submit a PR!  I will be providing more detailed contribution information in the near future.

## Credits
Data for this module is gathered and used from the [Liquipedia Dota 2 Wiki](http://liquipedia.net/dota2/Main_Page) under their [*CC-BY-SA 3.0 License*](http://liquipedia.net/dota2/Liquipedia:Copyrights)