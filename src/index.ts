import * as cheerio from 'cheerio';
import fetch, { RequestInit } from 'node-fetch';

const getRankings = () => {
    const requestInfo: RequestInit = {
        headers: {
            'Accept-Encoding': 'gzip',
            'User-Agent': 'GADotaSuite/0.0.1 (https://github.com/ammuench/google-assistant-dota)',
        },
        method: 'GET',
    };
    return fetch('http://liquipedia.net/dota2/api.php?action=parse&format=json&page=Dota_Pro_Circuit/Rankings', requestInfo);
};

getRankings()
    .then((res) => {
        return res.json();
    })
    .then((json) => {
        console.log(json);
    })
    .catch((err) => {
        console.log(err);
    });
