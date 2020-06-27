import { join, basename } from 'path';
import { IApi } from '@umijs/types';
import { Generator, randomColor } from '@umijs/utils';
import fs from 'fs';
var jcyFs = require('jcy-fs');
var inquirer = require('inquirer');
let dir: any = [];
async function chooseDir(path: any) {
    return new Promise((resolve) => {
        let files = fs.readdirSync(join(path, 'src', ...dir));
        files = files.filter(item => {
            return item.split('.').length == 1;
        });
        if (!files.length) {
            return resolve()
        }
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'dir',
                    message: 'choose a directory',
                    choices: [{
                        name: `确认为当前目录${join(path, 'src', ...dir)}`,
                        value: '_'
                    }].concat(files.map((item: any, index: any) => {
                        return {
                            name: item,
                            value: item,
                            checked: index == 0 ? true : false,
                        };
                    })).concat(dir.length?[
                        {
                            name:'返回上一级',
                            value:'-'
                        }
                    ]:[]),
                },
            ]).then(async (res: any) => {
                if (res.dir == '_') {
                    resolve()
                } else if(res.dir=='-'){
                    dir.pop();
                    await chooseDir(path)
                    resolve()
                }else{
                    dir.push(res.dir);
                    await chooseDir(path)
                    resolve()
                }
            })
    })


}
export default function ({ api }: { api: IApi }) {
    return class PageGenerator extends Generator {
        constructor(opts: any) {
            super(opts);
        }

        async writing() {
            dir=[];
            const [path] = this.args._;
            const jsExt = '.tsx';
            const cssExt = '.less';
            let name = basename(path);
            await chooseDir(join(api.cwd))
            let targetPath = join(api.cwd, 'src', ...dir, path);
            if (fs.existsSync(targetPath)) {
                jcyFs.delDir(targetPath);
            }
            fs.mkdirSync(targetPath); //创建目录
            console.log(api.config)
            this.copyTpl({
                templatePath: join(__dirname, `../template/component/index${jsExt}.tpl`),
                target: join(targetPath, `index${jsExt}`),
                context: {
                    path,
                    name: name,
                    cssExt,
                },
            });
            this.copyTpl({
                templatePath: join(__dirname, `../template/component/index.less.tpl`),
                target: join(targetPath, `/index${cssExt}`),
                context: {
                    name: name,
                    color: randomColor(),
                },
            });
        }
    };
}
