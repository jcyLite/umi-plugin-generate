import { IApi } from '@umijs/types';
import createPageGenerator from './createPageGenerator';

interface IRegisterGenerator {
  key: string;
  Generator: any;
}

export default (api: IApi) => {
  const {
    paths,
    utils: { chalk },
  } = api;
  api.registerGenerator({
    key: 'page',
    // @ts-ignore
    Generator: createPageGenerator({ api }),
  });
};
