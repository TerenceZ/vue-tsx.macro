# vue-tsx.macro

Make TSX (JSX for Typescript) work for Vue 2.

### HOW to use with vue-cli?

  __NOTICE__: The following steps may be extracted out to a vue-cli plugin in the future.

* #### use `vue-cli` to create a project with typescript and jsx support

* #### remove `@vue/cli-plugin-typescript`.

  ```bash
  yarn remove @vue/cli-plugin-typescript
  ```

* #### install `babel-plugin-macros` and `vue-tsx.macro`

  ```bash
  yarn add -D babel-plugin-macros vue-tsx.macro
  ```

* #### config `@vue/cli-service` to work with `vue-tsx.macro`

  * write a vue-cli plugin to config cli-service to work with typescript.

    ```js
    // modified from @vue/cli-plugin-typescript
    const path = require('path')

    module.exports = (api, options) => {
      const useThreads = process.env.NODE_ENV === 'production' && options.parallel

      api.chainWebpack(config => {
        config.resolveLoader.modules.prepend(
          path.join(__dirname, '../node_modules'),
        )

        if (!options.pages) {
          config
            .entry('app')
            .clear()
            .add('./src/main.ts')
        }

        config.resolve.extensions.merge(['.ts', '.tsx'])

        const tsRule = config.module.rule('ts').test(/\.ts$/)
        const tsxRule = config.module.rule('tsx').test(/\.tsx$/)

        // add a loader to both *.ts & vue<lang="ts">
        const addLoader = ({ loader, options }) => {
          tsRule
            .use(loader)
            .loader(loader)
            .options(options)
          tsxRule
            .use(loader)
            .loader(loader)
            .options(options)
        }

        addLoader({
          loader: 'cache-loader',
          options: api.genCacheConfig(
            'ts-babel-loader',
            {
              '@babel/core': require('@babel/core/package.json').version,
              '@babel/preset-typescript': require('@babel/preset-typescript/package.json')
                .version,
              typescript: require('typescript/package.json').version,
              modern: !!process.env.VUE_CLI_MODERN_BUILD,
              browserslist: api.service.pkg.browserslist,
            },
            ['tsconfig.json', 'babel.config.js', '.browserslistrc'],
          ),
        })

        if (useThreads) {
          addLoader({
            loader: 'thread-loader',
          })
        }

        addLoader({
          loader: 'babel-loader',
        })

        if (!process.env.VUE_CLI_TEST) {
          // this plugin does not play well with jest + cypress setup (tsPluginE2e.spec.js) somehow
          // so temporarily disabled for vue-cli tests
          config
            .plugin('fork-ts-checker')
            .use(require('fork-ts-checker-webpack-plugin'), [
              {
                async: true,
                vue: true,
                formatter: 'codeframe',
                useTypescriptIncrementalApi: true,
                // https://github.com/TypeStrong/ts-loader#happypackmode-boolean-defaultfalse
                checkSyntacticErrors: useThreads,
              },
            ])
        }
      })
    }
    ```
    
  * update `package.json` to let cli-service know this plugin:
  
  ```js
  
  {
    name: "...",
    ...,
    "vuePlugins": {
      "service": [
        "configs/cli-typescript-plugin.js"
      ]
    }
  }
  
  ```
  
* #### add `@babel/preset-app` and `babel-plugin-macros` to babel config, e.g.:
  
  ```js
  // babel.config.js
  module.exports = {
    presets: ['@vue/app', '@babel/typescript'],
    plugins: ['macros'],
  }
  ```
  
* #### update `tsconfig.json` to disable emitting files, e.g.:

  ```json
  {
    "compilerOptions": {
      "target": "esnext",
      "module": "esnext",
      "strict": true,
      "jsx": "preserve",
      "noEmit": true,
      "moduleResolution": "node",
      "resolveJsonModule": true,
      "experimentalDecorators": true,
      "esModuleInterop": true,
      "allowSyntheticDefaultImports": true,
      "forceConsistentCasingInFileNames": true,
      "baseUrl": ".",
      "paths": {
        "@/*": ["src/*"]
      },
      "lib": ["esnext", "dom", "dom.iterable", "scripthost"]
    },
    "include": ["src"],
    "exclude": ["node_modules"]
  }

  ```

* #### all setups are done. We can write __TSX__ for `vue` with __ALMOST ALL__ `typescript` benefits now.

  ```jsx
  import LogoAsset from '../assets/logo.png'
  import { component, type as t, EVENT_TYPES, SLOT_TYPES } from 'vue-tsx.macro'
  import HelloWorld from '../components/HelloWorld.vue'
  import { VNode } from 'vue'

  const Component = component({
    props: {
      // optional prop with type string | undefined.
      propWithVuePropType: String,
      // required prop with type number
      propWithVuePropDef: {
        type: Number,
        required: true,
      },
      // optional prop with type { a: number; b?: string } | undefined
      propWithTSType: t<{ a: number; b?: string }>(),
      // required prop
      propWithRequiredTSType: {
        type: t<number[]>(),
        required: true,
      },
    },

    // Declare component's events with their payload types.
    // This field will be removed by macro.
    [EVENT_TYPES]: {
      eventWithStringPayload: String,
      eventWithTSPayload: t<{ count: number }>(),
    },

    // Declare component's single child slot type.
    // Single required child of function.
    // Vue supports function child only if it's the only child.
    [SLOT_TYPES]: t<(count: number) => VNode>(),

    render() {
      return (
        <div>
          {this.propWithTSType ? this.propWithTSType.a : undefined}
          <HelloWorld />
          {this.$scopedSlots.default(this.propWithVuePropDef)}
        </div>
      )
    },
  })

  const Home = component({
    // the code will be benefit for all ts type hint.
    render() {
      return (
        <div
          class='home'
          on={{
            click: event => {
              console.log(event.target)
            },
          }}>
          <img alt='123' src={LogoAsset} />
          <Component propWithRequiredTSType={[1, 2]} propWithVuePropDef={123}>
            {() => <hr />}
          </Component>
        </div>
      )
    },
  })

  export default Home
  ```
  
