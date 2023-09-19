## 前端项目文档说明

## 基础命令

### 安装
```
npm install
```

### 运行
```
npm run dev
```

### 打包
```
npm run build
```

### 检查
```
npm run lint
```
## 登录账号地址和账号

测试账号密码
admin/c7mzKaLngyUkiG16

联调开发账号密码
admin/c7mzKaLngyUkiG16

## 简介
&emsp;&emsp;项目由前端团队成员开发维护。框架集成了技术栈有：

1、UI框架：Element

2、Vue技术相关：Vue2.0+、Axios、Vuex、Vue-Router

3、Css技术相关：css、Less、Sass、

4、vue插件：vue-pdf、v-viewer、html2canvas、vue-quill-editor等

5、其他相关的：vaue、Echarts、js-cookie、babel-polyfill等

## 编码规范

1、命名规范：

    使用英文语义化，禁止使用特殊字符，禁止使用拼音，禁止使用中英文混合

  （1）变量名、方法名、组件名、文件名、文件夹名遵循下命名规则：

      驼峰式：如：studentInfo、userInfo、productInfo 多单词首字母小写命名

      语义化：如：studentAge、userName、getUserName 能直观明白意图命名

      类型化：如：studentObj、userInfoArray、productString 能直观明白类型命名
      
  （2）变量声明 var、let、const

      当你的变量能保证不会被修改，则用const，如一些常量等

      如果是会一直修改，则使用let

      尽量不要使用var

  （3）常量命名

      命名方式：全部大写

      命名规范：使用大写字母和下划线来组合命名，下划线用以分割单词

  （4）css命名

      命名规范：
      
      类名使用小写字母以中划线分隔

      id采用驼峰命名方式

      scss中变量，函数，混合等采用驼峰命名
  

2、注释规范：

  （1）每个方法的功能用途必须写注释，方法内关键步骤和节点要写注释，尤其是不易被人理解的地方。

  （2）传参和返回结果，必须标注数据类型和参数说明。

  （3）方法采用多行注释，单行代码或if、swicth、for等js语句采用单行注释。

  （4）被注释并保留下来的代码，需标注说明保留原因。


3、vue组件模板规范：

  （1）data变量注释，例：（如下show和btnName有关联关系，我们就可以在modleInfo中写，避免变量杂乱无章可读性差）
      isAgree: true, //初审拟同意与拟不同意切换
      checkList: [], //复审依据数组
      modlenInfo:{
        show:true,//开关
        btnName:'关闭'//文本
      }
      
  （2）变量初始值规范

      建议：所有变量都要在data中进行初始化
        初始值是字符串类型的字段：
        userName:''
        初始值是 数组类型 的字段：
        userList:[]
        初始值是 对象类型 的字段：
        userInfo:{} 或时间对象：nowTime:new Date()
        初始值是 布尔类型 的字段：
        isUserEdit:false 或 isUserEdit:true
        初始值是 数字类型 的字段：
        userNum:0 或没有初始值的时候 userNum:NaN
        初始值 不确定类型 的字段：
        userPage:null

  （3）将对象的属性值保存为局部变量
      const person = {
        name: 'John',
        age: 30,
        gender: 'male'
      };
      //推荐
      const { name, age, gender } = person;
      console.log(name, age, gender);
      //不推荐
      console.log(person.name, person.age, person.gender);

  （4）数据模板

      对于一些较多字段的应用交互场景：比如，需要很多字段的表单填写，我们可以将这部分写在JS或JSON文件做为数据模板抽离出去然后暴露出来给组件调用。

      数据模板可以复用，在其他地方如果有用到就无需再次进行初始化，只需要在组件初始化定义一个变量名，然后引入。例如用户信息等

      js数据模板
      const userInfo = {
        userId:'',//用户id
        userName:'',//用户名字
        userSex:''//用户性别
        ....
      }

      数据模板导出
      export default userInfo

      模板调用
      import userInfo from "./userInfo.js"
      
      数据使用
      userInfo:Object.assign({},userInfo)或使用lodash
      注意：引入的数据模板必须对模板进行深度复制:****Object.assign({},obj) 或者JSON.parse(JSON.stringify(obj))****，否则数据浅复制会因修改相互影响

  （5）标签模板

      如果在一个页面需要较多标签，可能使页面代码超长，可维护性差。需要将标签分模块封装成模板组件，缩短代码长度。模板名称与引入的名称一致。
      components:{
        Finance,
        Insuranc,
        ...
      }

  （6）模板表达式

      组件模板应该只包含简单的表达式，复杂的表达式则应该重构为计算属性或方法。 

      computed:{
        RestFullName:function(){
            return this.fullName.split(' ').map(fucntion(){
              return word[0].toUpperCase()+word.slice(1)
            }).join('')
        }
      }

   （7）避免 v-if 和 v-for 用在一起

      不要把 v-if 和 v-for 同时用在同一个元素上。 

      v-for必须绑定 :key，并且保证key的唯一性（key不加可能造成Vue检测不到数据变化导致DOM视图层不更新）   

      过滤一个列表中的项目 (比如 v-for="user in users" v-if="user.isActive")。在这种情形下，

      请将 users 替换为一个计算属性 (比如 activeUsers)，让其返回过滤后的列表。

      使用template模板方式
      <viewer class="viewer">
        <template v-for="(fileArr,index) in item['applicationFile']">
            <img
            :key="index"
          v-if="fileArr.fileType =='image/png'|| fileArr.fileType =='image/jpg' || fileArr.fileType == 'image/jpeg' "
          :src="ip+'/hall/egfile/downloadFile/'+fileArr.fileId"
        />
        </template>
      </viewer>

  （8）父子组件通信规范

      应该优先通过 prop 和事件进行父子组件之间的通信，而不是 this.$parent 或改变 prop。

      为子组件设置ref 通过 this.$refs.child 调用子组件方法

  （9）vuex状态规范

      应用层级的状态应该集中到单个 store 对象中。

      提交 mutation 是更改状态的唯一方法，并且这个过程是同步的。

      异步逻辑都应该封装到 action 里面。

      如果你的 store 文件太大，只需将 action、mutation 和 getter 分割到单独的文件。

      对于大型应用，把 Vuex 相关代码分割到模块中。下面是项目结构示例：

      ├── index.html
      ├── main.js
      ├── api
      │   └── ... # 抽取出API请求
      ├── components
      │   ├── App.vue
      │   └── ...
      └── store
          ├── index.js          # 我们组装模块并导出 store 的地方
          ├── actions.js        # 根级别的 action
          ├── mutations.js      # 根级别的 mutation
          └── modules
              ├── cart.js       # 项目模块
              └── products.js   # 产品模块

      详细说明请参考https://vuex.vuejs.org/zh/guide/ 

    （10）自定义函数。请注明函数的调用方式，包括函数的领取地址、用途、参数类型等

      /*封装函数
      * 参数说明
      * @param {Function} request 请求 table 数据的函数,父级传入;如果父级已有 table data的数据，组件只负责展示，request 就不要传
      * @param {Function} dispose 自定义处理 request 完成之后得数据，最终返回处理结果 (el-table 得 data)
      * @param {[]} columns 循环生成 el-table-column 的数据,自定义显示需要手写对应的slot,写法和el-table的一样
      * @param {Function} select-change 自定义触发的 emit事件, 是对应 el-table 的 @select-all 和 @select事件
      */

 4、公共样式规范

    （1）. 少量样式可以写在组件，大量样式需要引入样式文件。

    （2）. 组件样式可以放在组件文件夹，公共样式放在src文件夹下的style文件夹

    （3）. 尽量使用类class选择器，尽量避免直接使用元素选择器 如：button{ ****background-color: red;****}，如有需要请用类选择器包裹起来。

    （4）. 改变UI内部组件的样式必须先添加样式前缀包裹，否则会引起UI组件的全局样式污染

    （5）. 属于组件单独的样式必须在style标签加scope作用域，并且不能用import引入样式文件


 5、公共目录存放规范

    （1）. components文件夹 和 view文件夹

      禁止在 src/components 目录下放置业务私有组件，业务私有组件应该在view文件夹里相关业务文件夹下建立components目录存放

    （2）. asset 文件夹

      用于存放静态资源文件，希望被webpack编译处理的静态资源文件，放置公共js、css、img模块，私有模块应在业务相关文件夹下建立目录存放

    （3）. static 文件夹

      用于存放静态资源文件，希望不被webpack编译处理的静态资源文件或者一些不兼容webpack的js/jq插件，文件夹分文件类型js、css、img、插件名称存放

    （4）. src/config、src/directives、rc/mixins、src/utils

      只允许存放系统级别的模块、配置、功能


## 安装其他依赖或者插件

### npm安装

&emsp;&emsp;1、使用npm install 依赖包名 --save 安装运行依赖包

&emsp;&emsp;2、使用npm install 依赖包名 --save -dev 安装开发依赖包


## 目录结构

|-- dist                               // 打包后的文件目录
|-- public                             // 公共静态资源文件，如index.html
|   |-- index.html
|-- src                                // 源码目录
|   |-- api                            // 接口请求相关文件
|   |   |-- ...                        // 接口实现文件
|   |-- assets                         // 图片，字体等静态资源文件
|   |-- components                     // 公共组件目录
|   |-- mixins                         // 公共 mixins
|   |-- router                         // 路由文件
|   |-- store                          // Vuex 状态管理文件
|   |-- utils                          // 公共工具函数资源等
|   |-- views                          // 页面组件目录
|   |-- App.vue                        // 根组件
|   |-- main.js                        // 入口文件
|-- .gitignore                         // git 忽略文件
|-- babel.config.js                    // babel 配置文件
|-- package.json                       // 依赖配置文件
|-- README.md                          // 项目规范说明文件
|-- vue.config.js                      // Vue 配置文件

## 分支结构

项目里使用git分支来管理不同章节的代码，根据自己的情况选择不同的分支进行开发。
<table>
  <thead>
    <tr>
      <th>分支名</th>
      <th>分支说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>master</td>
      <td>主分支,发版生产[生产环境]</td>
    </tr>
    <tr>
      <td>test</td>
      <td>[测试环境]</td>
    </tr>
    <tr>
      <td>hotFiex</td>
      <td>[热更分支]</td>
    </tr>
    <tr>
      <td>-</td>
      <td>[各自模块开发的分支]</td>
    </tr>
  </tbody>
</table>

## 分支合并、发布测试、以及上线说明

    1.开发新需求时从master拉取纯净分支进行开发（开发中时周期性拉取master保持同步）

    2.提测后将当前分支合并到test分支。测试回归完成后，将本地分支合并到master，删除本地分支

    3.hotFiex拉取master保持同步，如有热更新或紧急bug等修复在hotFiex分支进行修复

## 模块开发使用等注意事项

## git常用命令介绍

git init                创建一个分支

git clone               复制一个数据到制定文件夹

git add、git commit     把想提交的文件add上，然后commit这些文件到本地分支。

git pull                从服务器下载分支，并跟自己的分支合并。

git fetch               从服务器下载分支，并放到新分支，不跟自己的分支合并。

git whatchanged         查看两个分支的变化

git branch              创建分支，查看分支，删除分支

git checkout            切换分支

git merge               合并分支，把目标分支合并到当前分支

git config              配置相关信息，例如email和name

git log                 查看版本历史

git show                查看版本号对于版本的历史，如果参数是HEAD查看最新版本

git tag                 标定版本号（标签）

git reset               恢复到之前的版本

git push                向其他分支推送自己的分支

git status              显示当前的状态

git mv                  重命名文件或者文件夹

git rm                  删除文件或者文件夹

git help                查看帮助，还有几个无关紧要的命令，请自己查看帮助

git push origin --delete   分支名	删除远程仓库分支 开发完成并上线当前模块功能后删除分支

--mixed是git-reset的默认选项，它的作用是重置索引内容，将其定位到指定的项目版本，而不改变你的工作树中的所有内容，只是提示你有哪些文件还未更新。

--soft选项既不触动索引的位置，也不改变工作树中的任何内容。该选项会保留你在工作树中的所有更新并使之处于待提交状态。相当于在--mixed基础上加上git add。

--hard 把整个目录还原到一个版本，包括所有文件。
```

