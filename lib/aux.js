/**
 * Auxiliary functions
 *
 * @author Rogério Vicente <rogeriopvl@gmail.com>
 * @license MIT (see LICENSE file)
 */

module.exports = {
    // this sucks, path.normalize should  accept the home alias...
    // https://github.com/joyent/node/issues/2857
    expand: function(path){
        if (path.indexOf('~/') === 0){
            return path.replace(/~\//, process.env.HOME +  '/');
        }
        return path;
    }
};
