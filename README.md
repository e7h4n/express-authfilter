# authfilter

[![Build Status](https://travis-ci.org/perfectworks/express-authfilter.png?branch=master)](https://travis-ci.org/perfectworks/express-authfilter)

A simple auth filter middleware for express.

## Example

``` js
// ... whip up an express app

// create an auth filter
var filter = require('authfilter').create({
    // private zone, true for white list mode
    deny: true,
    // public zone
    allow: [
        '/public'
    ],
    // check user login state
    check: function (req, res) {
        return Boolean(req.session.user);
    },
    // login method
    login: function (req, res) {
        res.rediect('/login');
    }
});

app.use(filter);

app.get('/login', function (res, res) {
    res.session.user = 'pw';
});

app.get('/public', function (req, res) {
    res.send('you are in public zone');
});

app.get('/private', function (req, res) {
    res.send('you are in private zone');
});
```

## API usage

### `create(options)`

Return an auth filter middleware for express/connect.

* `options.allow [String|RegExp]`
 * Define an url list which allow user visit without auth check. Set to `true` to enable `whitelist` mode.
* `options.deny [String|RegExp]`
 * Define an url list which allow user visit with auth check. Set to `true` to enable `blacklist` mode.

### white list / black list mode

In white list mode, auth filter will give green light to all urls expect match in `option.deny` list, black list mode's behavior is the opposite.

## License

MIT
