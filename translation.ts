import fs from 'fs';
import {LANGUAGES, NAMESPACES} from './src/app/Constants';
import getApi from './src/app/utils/getApi';

const NS = NAMESPACES.filter(e => e !== 'main');

fetch(`${getApi()}/locales/${LANGUAGES.join('+')}/${NS.join('+')}`)
  .then(res => res.json())
  .then(res => {
    fs.rm(`./src/locales`, {recursive: true}, err => {
      if (err) {
        console.error(err);
      }
      fs.mkdir(`./src/locales/`, {recursive: true}, err => {
        if (err) {
          console.error(err);
        }
        fs.writeFile(
          `./src/locales/translation.json`,
          JSON.stringify(res, null, 2) || '',
          {
            flag: 'w+',
          },
          err => {
            if (err) {
              console.error(err);
            }
          },
        );
      });
      /* LANGUAGES.forEach(lang => {
        fs.mkdir(`./src/locales/${lang}`, {recursive: true}, err => {
          if (err) {
            console.error(err);
          }
          NS.forEach(namespace => {
            fs.writeFile(
              `./src/locales/${lang}/${namespace}.json`,
              JSON.stringify(res[lang][namespace], null, 2) || '',
              {
                flag: 'w+',
              },
              err => {
                if (err) {
                  console.error(err);
                }
              },
            );
          });
        });
      }); */
    });
  })
  .catch(err => console.error(err));
