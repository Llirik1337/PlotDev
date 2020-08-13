import * as mathjs from 'mathjs'

export default (ctx, inject) => {
  inject('math', mathjs)
}
