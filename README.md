# TAB · Traits Across Bryophytes

**A Planetary Synthesis of Bryophyte Traits**  
全球苔藓植物性状库 · 构建苔藓植物性状的行星全景

TAB 的双语科研门户采用 Node.js 静态生成，浏览器端使用原生 JavaScript。默认语言为英文，简体中文位于 `zh/`。十个主要栏目各有独立 HTML，并设双语图像署名页。所有图片和字体均从站点本地加载。

## 在本机预览

使用 Node.js 22.12 或更新版本。运行网站无需安装 npm 依赖。

```sh
npm run build
npm run check
npm start
```

打开 [本机预览](http://127.0.0.1:4173/TAB/)。此模式与 Pages 构建的数据范围一致。停止服务使用 Ctrl+C。如果 4173 已被占用，可通过环境变量 `PORT` 设置其他端口。

### 使用私有工作词典

在拥有工作簿的计算机上执行以下命令。将参数替换成自己的文件路径。提取工具使用 Python 3.9+ 标准库，Windows 也可以用 `py` 代替 `python`。

```sh
python scripts/import_glossary.py "/path/to/Appendix 2 Bryophyte_trait_glossary.xlsx"
npm run dev
```

打开 [本机中文性状探索器](http://127.0.0.1:4173/TAB/zh/traits/)。工具按七列提取词典，检查代码唯一性以及筛选状态与矩阵列的对应关系，结果写入 Git 忽略的 `private/glossary.json`。本机服务只绑定回环地址；`--local-glossary` 模式仅为本机请求提供该文件。公开构建从不复制该目录。持有词典 JSON 的研究者也可以在浏览器中使用“打开本地词典”。内容只在当前页面内存中解析，刷新后需重新选择。

## 统计口径与科学依据

| 数字   | 含义                                   | 来源                                 |
| ------ | -------------------------------------- | ------------------------------------ |
| 10,152 | 项目汇编涉及的物种名称数，含待归并名称 | 项目方确认的项目范围                 |
| 1,067  | 工作词典中的唯一原始编码字段数         | Explanation of traits                |
| 607    | 纳入筛选矩阵的编码字段数               | 词典筛选标记与 Trait Matrix 表头核对 |
| 4      | 科学框架规划的关联模块数               | 项目框架材料                         |

编码字段可以分别表示同一性状的不同状态。接受种数、独立生物学性状数及全球地理覆盖率仍有待核定。

项目背景参考项目方提供的 Word 草稿。四个模块、核心五类及各二级组依据项目方提供的框架文本。数据字典核对了 Explanation of traits、Trait Matrix 和 Read me。原稿中的备选项目名、论文占位数字以及概念演示条目不计入数据。生理资料整理、未来生化和基因组扩展的状态见数据库框架页。物种档案、空间数据图层和成果发布随数据审核推进。

## 内容与代码维护

| 路径                                                      | 用途                                                        |
| --------------------------------------------------------- | ----------------------------------------------------------- |
| `src/meta.mjs`、`src/shell.mjs`                           | 双语路由、页面标题、搜索引擎元数据、共用导航和页脚          |
| `src/home.mjs`、`src/site.css`、`src/site.js`             | 首页、响应式布局、图片浏览与可访问导航                      |
| `src/science.mjs`、`src/framework.mjs`、`src/science.css` | 科研页面、完整分类、参考资料和交互式示意                    |
| `src/explorer.js`、`src/explorer.css`                     | 按需载入词典、多条件筛选、检索、分页及详情                  |
| `scripts/import_glossary.py`                              | 只读离线提取和独立的暂定分类映射                            |
| `assets/media/credits.json`                               | 每个视觉素材的作者、原始链接、许可和衍生说明                |
| `assets/fonts/`                                           | 自托管字体与 SIL Open Font License 原文                     |
| `scripts/build.mjs`、`scripts/check.mjs`                  | 生成 Pages 文件、限制可复制资产、验证内部链接及私有目录隔离 |
| `.github/workflows/pages.yml`                             | GitHub Actions 构建、检查及经授权后部署                     |

修改栏目请同步维护两种语言和导航。添加分类时先核对科学框架，再维护检索映射。原始名称和定义按 Excel 的英文原文显示，中文界面提供字段与受控词汇译名。暂定映射独立保存在 JSON 的 `mapping` 键中；缺乏依据的对象、阶段及主题显示为待标注。新图像须先更新署名清单和构建中的媒体白名单。每次修改后重新构建并运行检查。

### 日后发布获准的词典子集

当前授权范围内，公开构建自带的词典记录数为 **0**。如项目方以后逐项批准公开，可在本机从审核后的词典中选取获准记录，将七个源字段和 `format`、`records` 包装为 `release/glossary.json`，经审核后再跟踪该文件。每条记录仅含 `id`、`name`、`definition`、`category`、`domain`、`dataType` 和 `selected`。格式值为 `tab-glossary-v1`，筛选状态为 `Yes` 或 `No`。构建器校验类型、重复编码与状态，重新按白名单序列化记录。原始矩阵、观测值及未经审定的映射始终留在本地。不要把含有额外数据的文件放入待公开仓库，Git 仓库本身也可被读取。

## 部署到 GitHub Pages

目标仓库为 [gujiqi/TAB](https://github.com/gujiqi/TAB)，预设项目路径为 `/TAB/`。页面使用真实子目录及相对资源路径，支持直接打开子页面和刷新。变更域名或项目路径时，用 `TAB_SITE_URL` 设置正式站点的完整基地址，并同步修改本地预览前缀或端口。该变量仅影响 canonical、hreflang、站点地图和分享元数据。

1. 公开之前核对下表、准备公开的 Git 历史以及本次构建的 `dist/` 文件。取得项目方对本次公开范围的授权。
2. 免费公共仓库部署时，将仅含获准源码与素材的目标仓库设为 Public。在 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
3. 在 **Settings → Secrets and variables → Actions → Variables** 创建仓库变量 `TAB_PUBLISH`，值为 `true`。缺省状态下工作流只构建与检查。
4. 在 **Actions → TAB Pages → Run workflow** 选择 `main` 启动，或向 `main` 推送更新。成功后访问工作流返回的 Pages URL，再测试中英文首页与深层路由。
5. 工作流只上传 `dist/`。移除该变量可停止后续部署；撤回已发布内容需在 Pages 设置中取消发布，并单独处理仓库访问和历史版本。

部署机制参见 [GitHub Pages 自定义工作流文档](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

## 首次拟公开的范围

| 对象             | 首次范围                                                                                                          |
| ---------------- | ----------------------------------------------------------------------------------------------------------------- |
| Pages            | 十个栏目与图像署名页的中英文 HTML，站点地图、样式、交互脚本及 .nojekyll                                           |
| 科学内容         | 经改写的项目背景与科普、框架和方法说明、建设状态，以及 10,152、1,067 和 607 的统计口径                            |
| 视觉素材         | TAB 标志衍生图、7 幅有来源的摄影（包括显微照片和地球照片）、分享图、署名清单、自托管字体与许可                    |
| 如将仓库设为公开 | 另包括生成器、源模板、离线提取脚本、公开资产、README、package.json、工作流及这些文件的 Git 历史                   |
| 保留在本地       | 原始 Word、Excel、粘贴的研究文本、原始完整 Logo 文件、完整词典 JSON、物种级矩阵和观测记录、测试截图及本地工作路径 |

当前不提供开放数据版本、物种记录下载、正式项目论文、数据许可或项目 DOI。各图片适用其署名页所列许可。此网站的摄影许可不延伸至项目科研数据。
