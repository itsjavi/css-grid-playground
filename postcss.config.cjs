const postcssJitProps = require('postcss-jit-props')
const OpenProps = require('open-props')
const postcssNesting = require('postcss-nesting')
const postcssImport = require('postcss-import')
const combineSelectors = require('postcss-combine-duplicated-selectors')
const postcssSorting = require('postcss-sorting')
const importGlob = require('postcss-import-ext-glob')

module.exports = {
  plugins: [
    importGlob(),
    postcssImport(),
    postcssJitProps(OpenProps),
    postcssNesting(),
    combineSelectors(),
    postcssSorting(),
    // cssnano()
  ],
}
