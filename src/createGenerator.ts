import { join, basename } from 'path';
import { IApi } from '@umijs/types';
import { Generator, randomColor } from '@umijs/utils';
import fs from 'fs';
var jcyFs = require('jcy-fs');
export default function({ api }: { api: IApi }) {
  return class PageGenerator extends Generator {
    constructor(opts: any) {
      super(opts);
    }

    async writing() {
      const [path] = this.args._;
      const jsExt = '.tsx';
      const cssExt = '.less';
      let name = basename(path);
      
      if (fs.existsSync(join(api.paths.absPagesPath!, path))) {
        jcyFs.delDir(join(api.paths.absPagesPath!, path));
      }
      fs.mkdirSync(join(api.paths.absPagesPath!, path)); //创建目录
      this.copyTpl({
        templatePath: join(__dirname, `../template/page/page${jsExt}.tpl`),
        target: join(api.paths.absPagesPath!, `${path}/index${jsExt}`),
        context: {
          path,
          name: name,
          cssExt,
        },
      });
      this.copyTpl({
        templatePath: join(__dirname, `../template/page/page.less.tpl`),
        target: join(api.paths.absPagesPath!, `${path}/index${cssExt}`),
        context: {
          name: name,
          color: randomColor(),
        },
      });
    }
  };
}
