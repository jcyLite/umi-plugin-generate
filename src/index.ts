import { IApi } from '@umijs/types';
import createPageGenerator from './createGenerator';
import createCptGenerator from './createCptGenerator';
interface IRegisterGenerator {
  key: string;
  Generator: any;
}

export default (api: IApi) => {
  const {
    paths,
    utils: { chalk },
  } = api;
  api.describe({
    key:'generate'
  })
  api.registerGenerator({
    key: 'cpt',
    // @ts-ignore
    Generator: createCptGenerator({ api }),
  });
};
