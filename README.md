# vue-tsx.macro

Make TSX (JSX for Typescript) work for Vue 2.

### HOW to use with vue-cli?

**SUGGESTION**: Try [vue-cli-plugin-tsx](https://github.com/TerenceZ/vue-cli-plugin-tsx) to simplify the steps!

- #### Use `vue-cli` to create a project with typescript and jsx support

- #### NOT COMPATIBLE with `@vue/cli-plugin-typescript`.

  ```bash
  yarn remove @vue/cli-plugin-typescript
  ```

- #### Install `babel-plugin-macros` and `vue-tsx.macro`

  ```bash
  yarn add -D babel-plugin-macros vue-tsx.macro
  ```

- #### Setup webpack to resolve `.ts / .tsx` through babel with typescript preset and macros plugin.

  Here is an example to config webpack through `vue-cli` plugin.

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

  And update `package.json` to let `@vue/cli-service` know this plugin:

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

  Then add `@babel/preset-app` and `babel-plugin-macros` to babel config, e.g.:

  ```js
  // babel.config.js
  module.exports = {
    presets: ['@vue/app', '@babel/typescript'],
    plugins: ['macros'],
  }
  ```

  At last update `tsconfig.json` to disable emitting files, e.g.:

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

- #### All setups are done. We can write **TSX** for `vue` with **ALMOST ALL** `typescript` benefits now.

  ```jsx
  import LogoAsset from '@/assets/logo.png'
  import { component, type as t, EVENTS, SLOTS } from 'vue-tsx.macro'
  import HelloWorld from '@/components/HelloWorld.vue'

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
    [EVENTS]: {
      eventWithStringPayload: String,
      eventWithTSPayload: t<{ count: number }>(),
    },

    // Declare component's scoped slots' scope (param) types.
    // Single required child of function.
    [SLOTS]: {
      default: {
        scope: Number,
        required: true,
      }
    },

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
    // Because Vue supports function child only if it's the only child.
    // It means if we only declare scoped slots with only one default one,
    // the component can accept a function.
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
            {() => [<hr />]}
          </Component>
        </div>
      )
    },
  })

  export default Home
  ```
